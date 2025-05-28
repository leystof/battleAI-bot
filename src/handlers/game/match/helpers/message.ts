import {bot} from "@/utils/bot";
import {InputFile} from "grammy";
import {Match} from "@/database/models/match";
import {User} from "@/database/models/user";
import {PromptAccuracyResult} from "@/handlers/game/match/prompt/checkResult";
import {getPercent} from "@/helpers/getPercent";
import {getUsername} from "@/helpers/getUsername";

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

export const genWinPromptText = (match: Match, analyze: PromptAccuracyResult, player: User) => {
    let opponent = (match.player1.id === player.id) ? match.player2 : match.player1

    return `
<b>🏆 Игра завершена - Вы победили!</b>

<b>🖼 Оригинальный промпт:</b>
"${match.originalPrompt}"

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

<b>👤 Соперник:</b> ${(opponent.usernameVisibility) ? getUsername(opponent) : '#hide'}
        `
}
export const genLosePromptText = (match: Match, analyze: PromptAccuracyResult, player: User) => {
    let opponent = (match.player1.id === player.id) ? match.player2 : match.player1

    return `
<b>🙈️️️️️️ Игра завершена - Вы проиграли.</b>

<b>🖼 Оригинальный промпт:</b>
"${match.originalPrompt}"

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

<b>👤 Соперник:</b> ${(opponent.usernameVisibility) ? getUsername(opponent) : '#hide'}
        `
}