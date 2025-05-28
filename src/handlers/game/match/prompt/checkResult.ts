import {matchRepository, userRepository} from "@/database";
import {
    genLosePromptText, genMatchPromptResultText,
    genWinPromptText,
    sendMsgToUser
} from "@/handlers/game/match/helpers/message";
import {getPercent} from "@/helpers/getPercent";
import {MatchStatus} from "@/database/models/match";
import {pool} from "@/modules/pool/instance";
import {AI} from "@/services/openai";
import {log} from "@/utils/logger";
import {clearMatchTimer} from "@/modules/timer/match";

export interface PromptAccuracyResult {
    player1Accuracy: number
    player2Accuracy: number
    originalPromptRu: string,
    reasoning: string
}

let noPromptsUserText = `Никто не ввел промпт, деньги возвращены на баланс с вычетом комисии 10%`
let noPromptLoseUserText = `Вы не ввели промпт вовремя, поэтому проиграли.`
let noPromptWinUserText = `Соперник не ввел промпт, вы выиграли!`

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

    if (match.player1Prompt === '' && match.player2Prompt === '') {
        pool.markGameFinished(match.player1.id,match.player2.id)
        try {
            match.player1.balance -= getPercent(match.bet, 10)
            match.player2.balance -= getPercent(match.bet, 10)
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

    if (match.player1Prompt === '' || match.player2Prompt === '') {
        pool.markGameFinished(match.player1.id,match.player2.id)

        try {
            if (match.player1Prompt === '') {
                match.win = match.player2
                match.player1.balance -= match.bet
                match.player2.balance += match.bet - getPercent(match.bet, 10)

                try { await sendMsgToUser(match.player1.tgId, noPromptLoseUserText); } catch (e) {}
                try { await sendMsgToUser(match.player2.tgId, noPromptWinUserText); } catch (e) {}
            }

            if (match.player2Prompt === '') {
                match.win = match.player1
                match.player2.balance -= match.bet
                match.player1.balance += match.bet - getPercent(match.bet, 10)

                try { await sendMsgToUser(match.player2.tgId, noPromptLoseUserText); } catch (e) {}
                try { await sendMsgToUser(match.player1.tgId, noPromptWinUserText); } catch (e) {}
            }

            await userRepository.save([
                match.player1,match.player2
            ])

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
5. Шкала ответа не должна быть одинаковая в двоих игроков

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
            match.player2.balance -= match.bet
            match.player1.balance += match.bet - getPercent(match.bet, 10)

            try { await sendMsgToUser(match.win.tgId, await genMatchPromptResultText(match,result,match.win)); } catch (e) {}
            try { await sendMsgToUser(match.player2.tgId, await genMatchPromptResultText(match,result,match.player2)); } catch (e) {}
        } else if (result.player1Accuracy < result.player2Accuracy) {
            match.win = match.player2
            match.player1.balance -= match.bet
            match.player2.balance += match.bet - getPercent(match.bet, 10)

            try { await sendMsgToUser(match.win.tgId, await genMatchPromptResultText(match,result,match.win)); } catch (e) {}
            try { await sendMsgToUser(match.player1.tgId, await genMatchPromptResultText(match,result,match.player1)); } catch (e) {}
        } else {
            match.player1.balance -= getPercent(match.bet, 10)
            match.player2.balance -= getPercent(match.bet, 10)

            try { await sendMsgToUser(match.player1.tgId, await genMatchPromptResultText(match,result,match.player1, true)); } catch (e) {}
            try { await sendMsgToUser(match.player2.tgId, await genMatchPromptResultText(match,result,match.player2, true)); } catch (e) {}

        }

        await userRepository.save([
            match.player1,match.player2
        ])

        match.status = MatchStatus.SUCCESSFUL
        await matchRepository.save(match)

    } catch (e) {
        log.error(e)
        match.status = MatchStatus.ERROR
        await matchRepository.save(match)
        return false
    }

}