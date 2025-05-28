"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createImagePromptGame = void 0;
const match_1 = require("../../../database/models/match");
const database_1 = require("../../../database");
const bot_1 = require("../../../utils/bot");
const generateImg_1 = require("../../../services/falai/generateImg");
const generateImagePrompt_1 = require("../../../services/openai/generateImagePrompt");
const instance_1 = require("../../../modules/pool/instance");
const grammy_1 = require("grammy");
const node_fetch_1 = __importDefault(require("node-fetch"));
const genText = `<b>Соперник найден!</b>\n\nСоздаю изображение...`;
const startText = `У вас есть 1 минута, чтобы написать наиболее точное описание этого изображения. Напишите ваш ответ в чат.`;
const cancelText = `<b>Ошибка при создании изображения, ставки возвращены на ваш баланс</b>`;
const timeoutText = `<b>⏳️️️️️️ 15 секунд до завершения игры!</b>`;
const createImagePromptGame = async (ctx, pair) => {
    const p1 = pair[0];
    const p2 = pair[1];
    const match = new match_1.Match();
    match.type = p1.type;
    match.bet = p1.bet;
    match.player1 = database_1.userRepository.create({ id: p1.userId });
    match.player2 = database_1.userRepository.create({ id: p2.userId });
    await database_1.matchRepository.save(match);
    try {
        await sendMsgToUser(p1.tgId, genText);
    }
    catch (e) { }
    try {
        await sendMsgToUser(p2.tgId, genText);
    }
    catch (e) { }
    let genPrompt;
    let genImg;
    try {
        genPrompt = await (0, generateImagePrompt_1.generateImagePrompt)();
    }
    catch (e) {
        match.status = match_1.MatchStatus.ERROR;
        await database_1.matchRepository.save(match);
        cancelGame(pair);
        try {
            await sendMsgToUser(p1.tgId, cancelText);
        }
        catch (e) { }
        try {
            await sendMsgToUser(p2.tgId, cancelText);
        }
        catch (e) { }
    }
    try {
        const r = await (0, generateImg_1.generateImage)(genPrompt);
        if (r["error"]) {
            throw new Error(genImg["error"]);
        }
        const response = await (0, node_fetch_1.default)(r["url"]);
        genImg = await response.buffer();
    }
    catch (e) {
        match.status = match_1.MatchStatus.ERROR;
        await database_1.matchRepository.save(match);
        cancelGame(pair);
        try {
            await sendMsgToUser(p1.tgId, cancelText);
        }
        catch (e) { }
        try {
            await sendMsgToUser(p2.tgId, cancelText);
        }
        catch (e) { }
    }
    try {
        await sendMsgPhotoToUser(p1.tgId, genImg, startText);
    }
    catch (e) {
        console.log(e);
    }
    try {
        await sendMsgPhotoToUser(p2.tgId, genImg, startText);
    }
    catch (e) {
        console.log(e);
    }
    match.status = match_1.MatchStatus.WAIT_PROMPTS;
    match.created_at = new Date();
    await database_1.matchRepository.save(match);
    setTimeout(async () => {
        const responseMatch = await database_1.matchRepository.findOne({
            where: {
                id: match.id
            }
        });
        if (responseMatch.status !== match_1.MatchStatus.SUCCESSFUL
            && responseMatch.status !== match_1.MatchStatus.ERROR) {
            try {
                await sendMsgToUser(p1.tgId, timeoutText);
            }
            catch (e) { }
            try {
                await sendMsgToUser(p2.tgId, timeoutText);
            }
            catch (e) { }
        }
    }, 45000);
};
exports.createImagePromptGame = createImagePromptGame;
function cancelGame(pair) {
    instance_1.pool.markGameFinished(pair[0].userId, pair[1].userId);
}
async function sendMsgPhotoToUser(chatId, buffer, text) {
    try {
        return bot_1.bot.api.sendPhoto(chatId, new grammy_1.InputFile(buffer), {
            caption: text,
            parse_mode: "HTML"
        });
    }
    catch (e) {
        console.log(e);
    }
}
async function sendMsgToUser(chatId, text) {
    try {
        return bot_1.bot.api.sendMessage(chatId, text, {
            parse_mode: "HTML"
        });
    }
    catch (e) { }
}
async function deleteMsg(chatId, messageId) {
    if (!messageId)
        return;
    try {
        return bot_1.bot.api.deleteMessage(chatId, messageId);
    }
    catch (e) { }
}
