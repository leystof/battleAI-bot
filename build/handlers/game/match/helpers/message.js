"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genLosePromptText = exports.genWinPromptText = exports.genMatchPromptResultText = exports.deleteMsg = exports.sendMsgToUser = exports.sendMsgPhotoToUser = void 0;
const bot_1 = require("../../../../utils/bot");
const grammy_1 = require("grammy");
const getPercent_1 = require("../../../../helpers/getPercent");
const getUsername_1 = require("../../../../helpers/getUsername");
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
exports.sendMsgPhotoToUser = sendMsgPhotoToUser;
async function sendMsgToUser(chatId, text) {
    try {
        return bot_1.bot.api.sendMessage(chatId, text, {
            parse_mode: "HTML"
        });
    }
    catch (e) { }
}
exports.sendMsgToUser = sendMsgToUser;
async function deleteMsg(chatId, messageId) {
    if (!messageId)
        return;
    try {
        return bot_1.bot.api.deleteMessage(chatId, messageId);
    }
    catch (e) { }
}
exports.deleteMsg = deleteMsg;
/**
 * Формирует текст результата матча.
 *
 * @param match    объект матча
 * @param analyze  результат анализа промптов
 * @param player   игрок-получатель сообщения
 * @param isDraw   ничья: true/false
 */
const genMatchPromptResultText = async (match, analyze, player, isDraw = false) => {
    const playerIsP1 = match.player1.id === player.id;
    const opponent = playerIsP1 ? match.player2 : match.player1;
    const playerPrompt = playerIsP1 ? match.player1Prompt : match.player2Prompt;
    const oppPrompt = playerIsP1 ? match.player2Prompt : match.player1Prompt;
    const playerAcc = playerIsP1 ? analyze.player1Accuracy : analyze.player2Accuracy;
    const oppAcc = playerIsP1 ? analyze.player2Accuracy : analyze.player1Accuracy;
    if (isDraw) {
        return `
<b>🤝 Игра завершена — Ничья.</b>

<b>🖼 Оригинальный промпт:</b>
"${analyze.originalPromptRu}"

<b>✏️ Ваш ответ:</b>
"${playerPrompt}"

<b>✏️ Ответ соперника:</b>
"${oppPrompt}"

<b>📊 Точность:</b>
<b>Ваша точность:</b> ${playerAcc}% 
<b>Точность соперника:</b> ${oppAcc}%
<b>Объяснение:</b>
<pre>${analyze.reasoning}</pre>

<b>💰 Ставка возвращена обоим игрокам.
(за вычетом комиссии платформы 10%)</b>

<b>👤 Соперник:</b> ${(opponent.usernameVisibility) ? await (0, getUsername_1.getUsername)(opponent) : '#hide'}
        `;
    }
    /* ----------  В Ы И Г Р Ы Ш  /  П Р О И Г Р Ы Ш  ---------- */
    const won = playerAcc > oppAcc;
    const heading = won
        ? "<b>🏆 Игра завершена — Вы победили!</b>"
        : "<b>🙈 Игра завершена — Вы проиграли.</b>";
    const yourLabel = won ? "✅ Ваш ответ" : "❌ Ваш ответ";
    const oppLabel = won ? "❌ Ответ соперника" : "✅ Ответ соперника";
    const payoutText = won
        ? `<b>💰 Выигрыш:</b> ${match.bet * 2 - (0, getPercent_1.getPercent)(match.bet * 2, 10)} ₽
(за вычетом комиссии платформы 10%)`
        : `<b>💰 Проигрыш:</b> ${match.bet} ₽`;
    return `
${heading}

<b>🖼 Оригинальный промпт:</b>
"${analyze.originalPromptRu}"

<b>${yourLabel}:</b>
"${playerPrompt}"

<b>${oppLabel}:</b>
"${oppPrompt}"

<b>📊 Результаты анализа:</b>
<b>Ваша точность:</b> ${playerAcc}%
<b>Точность соперника:</b> ${oppAcc}%
<b>Объяснение:</b>
<pre>${analyze.reasoning}</pre>

${payoutText}

<b>👤 Соперник:</b> ${(opponent.usernameVisibility) ? await (0, getUsername_1.getUsername)(opponent) : '#hide'}
    `;
};
exports.genMatchPromptResultText = genMatchPromptResultText;
const genWinPromptText = async (match, analyze, player) => {
    let opponent = (match.player1.id === player.id) ? match.player2 : match.player1;
    return `
<b>🏆 Игра завершена - Вы победили!</b>

<b>🖼 Оригинальный промпт:</b>
"${analyze.originalPromptRu}"

<b>✅ Ваш ответ:</b>
"${(match.player1.id === player.id) ? match.player1Prompt : match.player2Prompt}"

<b>❌ Ответ соперника:</b>
"${(match.player1.id === player.id) ? match.player2Prompt : match.player1Prompt}"

<b>📊 Результаты анализа:</b>
<b>Ваша точность:</b> ${(match.player1.id === player.id) ? analyze.player1Accuracy : analyze.player2Accuracy}%
<b>Точность соперника:</b> ${(match.player1.id === player.id) ? analyze.player2Accuracy : analyze.player1Accuracy}%
<b>Обьяснение:</b> 
<pre>${analyze.reasoning}</pre>

<b>💰 Выигрыш:</b> ${match.bet * 2 - (0, getPercent_1.getPercent)(match.bet * 2, 10)} ₽
(за вычетом комиссии платформы 10%)

<b>👤 Соперник:</b> ${(opponent.usernameVisibility) ? await (0, getUsername_1.getUsername)(opponent) : '#hide'}
        `;
};
exports.genWinPromptText = genWinPromptText;
const genLosePromptText = async (match, analyze, player) => {
    let opponent = (match.player1.id === player.id) ? match.player2 : match.player1;
    return `
<b>🙈️️️️️️ Игра завершена - Вы проиграли.</b>

<b>🖼 Оригинальный промпт:</b>
"${analyze.originalPromptRu}"

<b>❌ Ваш ответ:</b>
"${(match.player1.id === player.id) ? match.player1Prompt : match.player2Prompt}"

<b>✅ Ответ соперника:</b>
"${(match.player1.id === player.id) ? match.player2Prompt : match.player1Prompt}"

<b>📊 Результаты анализа:</b>
<b>Ваша точность:</b> ${(match.player1.id === player.id) ? analyze.player1Accuracy : analyze.player2Accuracy}%
<b>Точность соперника:</b> ${(match.player1.id === player.id) ? analyze.player2Accuracy : analyze.player1Accuracy}%
<b>Обьяснение:</b> 
<pre>${analyze.reasoning}</pre>

<b>💰 Проигрыш:</b> ${match.bet} ₽

<b>👤 Соперник:</b> ${(opponent.usernameVisibility) ? await (0, getUsername_1.getUsername)(opponent) : '#hide'}
        `;
};
exports.genLosePromptText = genLosePromptText;
