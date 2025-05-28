import {bot} from "@/utils/bot";
import {InputFile} from "grammy";
import {Match} from "@/database/models/match";
import {User} from "@/database/models/user";
import {PromptAccuracyResult} from "@/handlers/game/match/prompt/checkResult";
import {getPercent} from "@/helpers/getPercent";
import {getUsername} from "@/helpers/getUsername";
import {createRawApi} from "grammy/out/core/client";

export async function sendMsgPhotoToUser(chatId: number, buffer: string, text: string) {
    try {
        return bot.api.sendPhoto(chatId, new InputFile(buffer), {
            caption: text,
            parse_mode: "HTML"
        })
    } catch (e) {
        console.log(e)
    }
}

export async function sendMsgToUser(chatId: number, text: string) {
    try {
        return bot.api.sendMessage(chatId, text, {
            parse_mode: "HTML"
        })
    } catch (e) {}
}

export async function deleteMsg(chatId: number, messageId: number) {
    if (!messageId) return
    try {
        return bot.api.deleteMessage(chatId, messageId)
    } catch (e) {}
}

/**
 * Формирует текст результата матча.
 *
 * @param match    объект матча
 * @param analyze  результат анализа промптов
 * @param player   игрок-получатель сообщения
 * @param isDraw   ничья: true/false
 */
export const genMatchPromptResultText = async (
    match: Match,
    analyze: PromptAccuracyResult,
    player: User,
    isDraw: boolean = false
) => {
    const playerIsP1   = match.player1.id === player.id;
    const opponent     = playerIsP1 ? match.player2 : match.player1;

    const playerPrompt = playerIsP1 ? match.player1Prompt : match.player2Prompt;
    const oppPrompt    = playerIsP1 ? match.player2Prompt : match.player1Prompt;

    const playerAcc    = playerIsP1 ? analyze.player1Accuracy : analyze.player2Accuracy;
    const oppAcc       = playerIsP1 ? analyze.player2Accuracy : analyze.player1Accuracy;

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

<b>👤 Соперник:</b> ${(opponent.usernameVisibility) ? await getUsername(opponent) : '#hide'}
        `;
    }

    /* ----------  В Ы И Г Р Ы Ш  /  П Р О И Г Р Ы Ш  ---------- */
    const won        = playerAcc > oppAcc;

    const heading    = won
        ? "<b>🏆 Игра завершена — Вы победили!</b>"
        : "<b>🙈 Игра завершена — Вы проиграли.</b>";

    const yourLabel  = won ? "✅ Ваш ответ"     : "❌ Ваш ответ";
    const oppLabel   = won ? "❌ Ответ соперника" : "✅ Ответ соперника";

    const payoutText = won
        ? `<b>💰 Выигрыш:</b> ${match.bet * 2 - getPercent(match.bet * 2, 10)} ₽
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

<b>👤 Соперник:</b> ${(opponent.usernameVisibility) ? await getUsername(opponent) : '#hide'}
    `;
};

export const genWinPromptText = async (match: Match, analyze: PromptAccuracyResult, player: User) => {
    let opponent = (match.player1.id === player.id) ? match.player2 : match.player1

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

<b>💰 Выигрыш:</b> ${match.bet * 2 - getPercent(match.bet * 2, 10)} ₽
(за вычетом комиссии платформы 10%)

<b>👤 Соперник:</b> ${(opponent.usernameVisibility) ? await getUsername(opponent) : '#hide'}
        `
}
export const genLosePromptText = async (match: Match, analyze: PromptAccuracyResult, player: User) => {
    let opponent = (match.player1.id === player.id) ? match.player2 : match.player1

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

<b>👤 Соперник:</b> ${(opponent.usernameVisibility) ? await getUsername(opponent) : '#hide'}
        `
}