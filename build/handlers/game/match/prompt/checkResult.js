"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkResultPrompt = void 0;
const database_1 = require("../../../../database");
const message_1 = require("../../../../handlers/game/match/helpers/message");
const getPercent_1 = require("../../../../helpers/getPercent");
const match_1 = require("../../../../database/models/match");
const instance_1 = require("../../../../modules/pool/instance");
const openai_1 = require("../../../../services/openai");
const logger_1 = require("../../../../utils/logger");
let noPromptsUserText = `Никто не ввел промпт, деньги возвращены на баланс с вычетом комисии 10%`;
let noPromptLoseUserText = `Вы не ввели промпт вовремя, поэтому проиграли.`;
let noPromptWinUserText = `Соперник не ввел промпт, вы выиграли!`;
async function checkResultPrompt(matchId) {
    const match = await database_1.matchRepository.findOne({
        where: {
            id: matchId
        },
        relations: ['player1', 'player2']
    });
    if (match.status !== match_1.MatchStatus.WAIT_PROMPTS)
        return true;
    if (match.player1Prompt === '' && match.player2Prompt === '') {
        instance_1.pool.markGameFinished(match.player1.id, match.player2.id);
        try {
            match.player1.balance -= (0, getPercent_1.getPercent)(match.bet, 10);
            match.player2.balance -= (0, getPercent_1.getPercent)(match.bet, 10);
            await database_1.userRepository.save([
                match.player1, match.player2
            ]);
            try {
                await (0, message_1.sendMsgToUser)(match.player1.tgId, noPromptsUserText);
            }
            catch (e) { }
            try {
                await (0, message_1.sendMsgToUser)(match.player2.tgId, noPromptsUserText);
            }
            catch (e) { }
            match.status = match_1.MatchStatus.SUCCESSFUL;
            await database_1.matchRepository.save(match);
            return true;
        }
        catch (e) {
            match.status = match_1.MatchStatus.ERROR;
            await database_1.matchRepository.save(match);
            return false;
        }
    }
    if (match.player1Prompt === '' || match.player2Prompt === '') {
        instance_1.pool.markGameFinished(match.player1.id, match.player2.id);
        try {
            if (match.player1Prompt === '') {
                match.win = match.player2;
                match.player1.balance -= match.bet;
                match.player2.balance += match.bet - (0, getPercent_1.getPercent)(match.bet, 10);
                try {
                    await (0, message_1.sendMsgToUser)(match.player1.tgId, noPromptLoseUserText);
                }
                catch (e) { }
                try {
                    await (0, message_1.sendMsgToUser)(match.player2.tgId, noPromptWinUserText);
                }
                catch (e) { }
            }
            if (match.player2Prompt === '') {
                match.win = match.player1;
                match.player2.balance -= match.bet;
                match.player1.balance += match.bet - (0, getPercent_1.getPercent)(match.bet, 10);
                try {
                    await (0, message_1.sendMsgToUser)(match.player2.tgId, noPromptLoseUserText);
                }
                catch (e) { }
                try {
                    await (0, message_1.sendMsgToUser)(match.player1.tgId, noPromptWinUserText);
                }
                catch (e) { }
            }
            await database_1.userRepository.save([
                match.player1, match.player2
            ]);
            match.status = match_1.MatchStatus.SUCCESSFUL;
            await database_1.matchRepository.save(match);
        }
        catch (e) {
            match.status = match_1.MatchStatus.ERROR;
            await database_1.matchRepository.save(match);
            return false;
        }
    }
    let { text } = await openai_1.AI.aiGenerateText({
        model: openai_1.AI.client("gpt-4o"),
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
  "reasoning": "Очень краткое объяснение, почему ты присвоил именно такие оценки и какие ключевые различия между ответами"
}`,
        temperature: 0.1,
        maxTokens: 500,
    });
    instance_1.pool.markGameFinished(match.player1.id, match.player2.id);
    text = text.replaceAll("```json", "");
    text = text.replaceAll("```", "");
    try {
        const result = JSON.parse(text);
        if (result.player1Accuracy > result.player2Accuracy) {
            match.win = match.player1;
            match.player2.balance -= match.bet;
            match.player1.balance += match.bet - (0, getPercent_1.getPercent)(match.bet, 10);
            try {
                await (0, message_1.sendMsgToUser)(match.win.tgId, (0, message_1.genWinPromptText)(match, result, match.win));
            }
            catch (e) { }
            try {
                await (0, message_1.sendMsgToUser)(match.player2.tgId, (0, message_1.genLosePromptText)(match, result, match.player2));
            }
            catch (e) { }
        }
        else {
            match.win = match.player2;
            match.player1.balance -= match.bet;
            match.player2.balance += match.bet - (0, getPercent_1.getPercent)(match.bet, 10);
            try {
                await (0, message_1.sendMsgToUser)(match.win.tgId, (0, message_1.genWinPromptText)(match, result, match.win));
            }
            catch (e) { }
            try {
                await (0, message_1.sendMsgToUser)(match.player1.tgId, (0, message_1.genLosePromptText)(match, result, match.player1));
            }
            catch (e) { }
        }
        await database_1.userRepository.save([
            match.player1, match.player2
        ]);
        match.status = match_1.MatchStatus.SUCCESSFUL;
        await database_1.matchRepository.save(match);
    }
    catch (e) {
        logger_1.log.error(e);
        match.status = match_1.MatchStatus.ERROR;
        await database_1.matchRepository.save(match);
        return false;
    }
}
exports.checkResultPrompt = checkResultPrompt;
