import {configRepository, matchRepository, userRepository} from "@/database";
import {
    genMatchPromptResultText,
    sendMsgToUser
} from "@/handlers/game/match/helpers/message";
import fetch from "node-fetch";

import {getPercent} from "@/helpers/getPercent";
import {MatchStatus} from "@/database/models/match";
import {pool} from "@/modules/pool/instance";
import {AI} from "@/services/openai";
import {log} from "@/utils/logger";
import {clearMatchTimer} from "@/modules/timer/match";
import {alertBot, bot} from "@/utils/bot";
import {getUsername} from "@/helpers/getUsername";
import {generateImage} from "@/services/falai/generateImg";
import * as wasi from "wasi";
import {getCachedConfig} from "@/modules/cache/config";

export interface PromptAccuracyResult {
    player1Accuracy: number
    player2Accuracy: number
    originalPromptRu: string,
    reasoning: string
}

let noPromptsUserText = `⏱️ Время на ответ истекло! Ни один из игроков не успел ответить. Игра отменена, ваша ставка возвращена за вычетом комиссии платформы.`
let noPromptLoseUserText = `Вы не ввели промпт вовремя, поэтому проиграли.`
let noPromptWinUserText = `Соперник не ввел промпт, вы выиграли!`

let startAnalyzeText = `<b>🔍 Анализируем ваши ответы...</b>`

export async function checkResultPrompt(matchId: number) {
    clearMatchTimer(matchId)
    const match = await matchRepository.findOne({
        where: {
            id: matchId
        },
        relations: ['player1', 'player2']
    })

    if (match.status !== MatchStatus.WAIT_PROMPTS) return true
    match.status = MatchStatus.ANALYZE
    await matchRepository.save(match)

    const config = await getCachedConfig()

    try { await sendMsgToUser(match.player1.tgId, startAnalyzeText); } catch (e) {}
    try { await sendMsgToUser(match.player2.tgId, startAnalyzeText); } catch (e) {}

    if (match.player1Prompt === '' && match.player2Prompt === '') {
        pool.markGameFinished(match.player1.id,match.player2.id)
        try {
            match.player1.balance = Number(match.player1.balance) - getPercent(match.bet, config.matchFeePercent)
            match.player1.wager = Math.max(0,Number(match.player1.wager) - match.bet)

            match.player2.balance = Number(match.player2.balance) - getPercent(match.bet, config.matchFeePercent)
            match.player2.wager = Math.max(0,Number(match.player2.wager) - match.bet)

            await userRepository.save([
                match.player1,match.player2
            ])

            try { await sendMsgToUser(match.player1.tgId, noPromptsUserText); } catch (e) {}
            try { await sendMsgToUser(match.player2.tgId, noPromptsUserText); } catch (e) {}

            match.status = MatchStatus.SUCCESSFUL
            await matchRepository.save(match)
            return true
        } catch (e) {
            match.status = MatchStatus.ERROR
            await matchRepository.save(match)
            return false
        }
    }

    try {
        let { text } = await AI.aiGenerateText({
            model: AI.client("gpt-4o"),
            prompt: `Ты - судья в игре, где игроки пытаются угадать оригинальный промпт, использованный для генерации изображения.

Оригинальный промпт: "${match.originalPrompt}"

Ответ Игрока 1: "${match.player1Prompt}"
Ответ Игрока 2: "${match.player2Prompt}"

ВАЖНО: Ты ДОЛЖЕН определить победителя. Ничья возможна ТОЛЬКО если ответы игроков ��рактически идентичны по смыслу и точности.

Оцени точность каждого ответа по шкале от 0 до 100, где 100 - идеальное совпадение с оригинальным промптом по смыслу и деталям.

Учитывай следующие факторы:
1. Насколько точно игрок уловил основную тему и объекты (наиболее важно)
2. Насколько точно описаны детали, цвета, композиция
3. Насколько точно передана атмосфера и стиль
4. Количество правильно угаданных ключевых элементов
6. Если игрок оставил поле пустим, задаем значение -1, но если там есть хоть какой-то текст, хоть 1 буква, то считаем

Даже если разница между игроками небольшая, ты ДОЛЖЕН отразить эту разницу в оценках.
Если один игрок упомянул больше правильных деталей или точнее описал сцену, его оценка ДОЛЖНА быть выше.

Сначала проведи детальный анализ каждого ответа, сравнивая с оригинальным промптом.
Затем определи оценки, которые точно отражают разницу в качестве ответов.

Верни ответ ТОЛЬКО в следующем формате JSON без дополнительных пояснений:
{
  "player1Accuracy": число от 0 до 100,
  "player2Accuracy": число от 0 до 100,
  "originalPromptRu": "Оригинальный промпт на русском (не больше 170 символов)",
  "reasoning": "Очень краткое объяснение, почему ты присвоил именно такие оценки и какие ключевые различия между ответами"
}`,
            temperature: 0.1,
            maxTokens: 500,
        })
        pool.markGameFinished(match.player1.id,match.player2.id)

        text = text.replaceAll("```json", "")
        text = text.replaceAll("```", "")
        const result = JSON.parse(text) as PromptAccuracyResult

        if (result.player1Accuracy > result.player2Accuracy) {
            match.win = match.player1
            match.player1.wager = Math.max(0,Number(match.player1.wager) - match.bet)
            match.player2.wager = Math.max(0,Number(match.player2.wager) - match.bet)

            match.player1.totalWin = Number(match.player1.totalWin) + 1
            match.player2.totalLose = Number(match.player2.totalLose) + 1
            match.player1.totalWinAmount = Number(match.player1.totalWinAmount) + match.bet * 2 - getPercent(match.bet * 2, config.matchFeePercent)

            match.player2.balance = Number(match.player2.balance) - match.bet
            match.player1.balance = Number(match.player1.balance) + match.bet - getPercent(match.bet * 2, config.matchFeePercent)

            try { await sendMsgToUser(match.win.tgId, await genMatchPromptResultText(match,result,match.win)); } catch (e) {}
            try { await sendMsgToUser(match.player2.tgId, await genMatchPromptResultText(match,result,match.player2)); } catch (e) {}
        } else if (result.player1Accuracy < result.player2Accuracy) {
            match.win = match.player2
            match.player1.wager = Math.max(0,Number(match.player1.wager) - match.bet)
            match.player2.wager = Math.max(0,Number(match.player2.wager) - match.bet)

            match.player1.totalLose = Number(match.player1.totalLose) + 1
            match.player2.totalWin = Number(match.player2.totalWin) + 1
            match.player2.totalWinAmount = Number(match.player2.totalWinAmount) + match.bet * 2 - getPercent(match.bet * 2, config.matchFeePercent)

            match.player1.balance = Number(match.player1.balance) - match.bet
            match.player2.balance = Number(Number(match.player2.balance)) + match.bet - getPercent(match.bet * 2, config.matchFeePercent)

            try { await sendMsgToUser(match.win.tgId, await genMatchPromptResultText(match,result,match.win)); } catch (e) {}
            try { await sendMsgToUser(match.player1.tgId, await genMatchPromptResultText(match,result,match.player1)); } catch (e) {}
        } else {
            match.player1.wager = Math.max(0,Number(match.player1.wager) - match.bet)
            match.player2.wager = Math.max(0,Number(match.player2.wager) - match.bet)

            match.player1.balance = Number(match.player1.balance) - getPercent(match.bet, config.matchFeePercent)
            match.player2.balance = Number(match.player2.balance) - getPercent(match.bet, config.matchFeePercent)

            try { await sendMsgToUser(match.player1.tgId, await genMatchPromptResultText(match,result,match.player1, true)); } catch (e) {}
            try { await sendMsgToUser(match.player2.tgId, await genMatchPromptResultText(match,result,match.player2, true)); } catch (e) {}
        }

        await userRepository.save([
            match.player1,match.player2
        ])

        match.status = MatchStatus.SUCCESSFUL
        await matchRepository.save(match)

        try {
            if (!match.win) return;

            await alertBot.api.sendPhoto(config.channelLiveId, match.img_url, {
                parse_mode: "HTML",
                caption: `
<b>🏆 ПОБЕДА В МАТЧЕ — BattleAI 🏆</b>

<b>🎯 Победитель:</b> ${await getUsername(match.win, match.win.usernameVisibility)}
<b>💰 Выигрыш:</b> ${match.bet * 2 - getPercent(match.bet * 2, match.feePercent)} ₽
<b>📊 Точность:</b> ${(match.win.id === match.player1.id) ? result.player1Accuracy : '61'}%
                `,
                reply_markup: {
                    inline_keyboard: [
                        [{text: "🔥️️️️️️ ПРИСОЕДИНЯЙТЕСЬ К ИГРЕ! 🔥️️️️️️", url: `https://t.me/BattleAI_robot`}]
                    ]
                }
            })
        } catch (e) {
            console.log(e)
        }
    } catch (e) {
        log.error(e)
        match.status = MatchStatus.ERROR
        await matchRepository.save(match)
        return false
    }

}