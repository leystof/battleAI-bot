import {Context} from "@/database/models/context";
import {Player} from "@/modules/pool/pool";
import {Match, MatchStatus} from "@/database/models/match";
import {matchRepository, userRepository} from "@/database";
import {bot} from "@/utils/bot";
import {generateImage} from "@/services/falai/generateImg";
import {generateImagePrompt} from "@/services/openai/generateImagePrompt";
import {pool} from "@/modules/pool/instance";
import {InputFile} from "grammy";
import fetch from "node-fetch";
import {sendMsgPhotoToUser, sendMsgToUser} from "@/handlers/game/match/helpers/message";
import {checkResultPrompt} from "@/handlers/game/match/prompt/checkResult";

const genText = `<b>Соперник найден!</b>\n\nСоздаю изображение...`
const startText = `У вас есть 1 минута, чтобы написать наиболее точное описание этого изображения. Напишите ваш ответ в чат.`
const cancelText = `<b>Ошибка при создании изображения, ставки возвращены на ваш баланс</b>`

const timeoutText = `<b>⏳️️️️️️ 15 секунд до завершения игры!</b>`
export const createImagePromptGame = async (ctx: Context, pair: Player[]) => {
    const p1 = pair[0]
    const p2 = pair[1]

    const match = new Match()
    match.type = p1.type
    match.bet = p1.bet
    match.bet = p1.bet
    match.player1 = userRepository.create({id: p1.userId})
    match.player2 = userRepository.create({id: p2.userId})

    await matchRepository.save(match)


    try { await sendMsgToUser(p1.tgId, genText); } catch (e) {}
    try { await sendMsgToUser(p2.tgId, genText); } catch (e) {}

    let genPrompt
    let genImg

    try {
        genPrompt = await generateImagePrompt()
        match.originalPrompt = genPrompt
        await matchRepository.save(match)
    } catch (e) {
        match.status = MatchStatus.ERROR
        await matchRepository.save(match)
        cancelGame(pair)
        try { await sendMsgToUser(p1.tgId, cancelText); } catch (e) {}
        try { await sendMsgToUser(p2.tgId, cancelText); } catch (e) {}
        return false
    }

    try {
        const r = await generateImage(genPrompt)

        if (r["error"]) {
            throw new Error(genImg["error"])
        }

        const response = await fetch(r["url"]);
        genImg = await response.buffer();
    } catch (e) {
        match.status = MatchStatus.ERROR
        await matchRepository.save(match)
        cancelGame(pair)
        try { await sendMsgToUser(p1.tgId, cancelText); } catch (e) {}
        try { await sendMsgToUser(p2.tgId, cancelText); } catch (e) {}
        return false
    }

    try {await sendMsgPhotoToUser(p1.tgId, genImg, startText)} catch (e) {console.log(e)}
    try {await sendMsgPhotoToUser(p2.tgId, genImg, startText)} catch (e) {console.log(e)}

    match.status = MatchStatus.WAIT_PROMPTS
    match.created_at = new Date()
    await matchRepository.save(match)

    setTimeout(async () => {
        const responseMatch = await matchRepository.findOne({
            where: {
                id: match.id
            }
        })
        if (responseMatch.status === MatchStatus.WAIT_PROMPTS) {
            try { await sendMsgToUser(p1.tgId, timeoutText); } catch (e) {}
            try { await sendMsgToUser(p2.tgId, timeoutText); } catch (e) {}
        }
    }, 45_000)

    setTimeout(async () => {
        try {
            await checkResultPrompt(match.id)
        } catch (e){}
    }, 65_000)
}

function cancelGame(pair: Player[]) {
    pool.markGameFinished(pair[0].userId, pair[1].userId)
}