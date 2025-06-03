import {Context} from "@/database/models/context";
import {Player} from "@/modules/pool/pool";
import {Match, MatchStatus} from "@/database/models/game/match";
import {configRepository, matchRepository, userRepository} from "@/database";
import {generateImage} from "@/services/falai/generateImg";
import {generateImagePrompt} from "@/services/openai/generateImagePrompt";
import {pool} from "@/modules/pool/instance";
import fetch from "node-fetch";
import {sendMsgPhotoToUser, sendMsgToUser} from "@/handlers/game/match/helpers/message";
import {checkResultPrompt} from "@/handlers/game/match/prompt/checkResult";
import {setMatchTimer} from "@/modules/timer/match";
import {User} from "@/database/models/user/user";
import {getPercent} from "@/helpers/getPercent";
import {getUsername} from "@/helpers/getUsername";

const genText = async (match: Match, player: User) => {
    const opponentId = (match.player1.id === player.id) ? match.player2 : match.player1
    const opponent = await userRepository.findOne({
        where: {
            id: opponentId.id
        }
    })

    return `
<b>🎮 Игра начинается! 🎮</b>

<b>👤 Ваш соперник:</b> ${await getUsername(opponent,opponent.usernameVisibility)}

<b>💰 Ваша ставка на игру:</b>
${match.bet} ₽

<b>🏆 Потенциальный выигрыш:</b>
${match.bet * 2 - getPercent(match.bet * 2, match.feePercent)} ₽

⏱️ У вас есть 60 секунд, чтобы описать изображение.
Пожалуйста, отправьте ваш ответ в чат.
`}

const startText = `
🖼️ <b>Опишите это изображение</b>

У вас есть 60 секунд, чтобы отправить свой ответ.`
const cancelText = `<b>Ошибка при создании изображения, ставки возвращены на ваш баланс</b>`

const timeoutText = `<b>⏳️️️️️️ 15 секунд до завершения игры!</b>`
export const createImagePromptGame = async (ctx: Context, pair: Player[]) => {
    const p1 = pair[0]
    const p2 = pair[1]

    const config = await configRepository.
        findOne({where: {id: 1}})

    const match = new Match()
    match.type = p1.type
    match.feePercent = config.matchFeePercent
    match.bet = p1.bet
    match.bet = p1.bet
    match.player1 = userRepository.create({id: p1.userId})
    match.player2 = userRepository.create({id: p2.userId})

    await matchRepository.save(match)


    try { await sendMsgToUser(p1.tgId, await genText(match,match.player1)); } catch (e) {}
    try { await sendMsgToUser(p2.tgId, await genText(match,match.player2)); } catch (e) {}

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

        match.img_url = r["url"]
    } catch (e) {
        console.log(e)
        match.status = MatchStatus.ERROR
        await matchRepository.save(match)
        cancelGame(pair)
        try { await sendMsgToUser(p1.tgId, cancelText); } catch (e) {}
        try { await sendMsgToUser(p2.tgId, cancelText); } catch (e) {}
        return false
    }

    try {await sendMsgPhotoToUser(p1.tgId, match.img_url, startText)} catch (e) {console.log(e)}
    try {await sendMsgPhotoToUser(p2.tgId, match.img_url, startText)} catch (e) {console.log(e)}

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

    setMatchTimer(match.id, () => checkResultPrompt(match.id), 65_000)
    // setTimeout(async () => {
    //     try {
    //         await checkResultPrompt(match.id)
    //     } catch (e){}
    // }, 65_000)
}

function cancelGame(pair: Player[]) {
    pool.markGameFinished(pair[0].userId, pair[1].userId)
}