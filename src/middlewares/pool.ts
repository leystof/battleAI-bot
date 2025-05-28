import {InlineKeyboard, NextFunction} from 'grammy'
import {matchRepository} from "@/database";
import {pool} from "@/modules/pool/instance";
import {Context} from "@/database/models/context";
import {In, MoreThanOrEqual} from "typeorm";
import {MatchStatus} from "@/database/models/match";
import {setMatchPrompt} from "@/handlers/game/match/prompt/setPrompt";

export const poolMiddleware = async (ctx: Context, next: NextFunction) => {
    const userInPool = pool.isInPool(ctx.user.id)
    const userInMatch = pool.isInMatch(ctx.user.id)

    if (userInPool && ctx?.callbackQuery?.data !== "game match cancel") {
        return ctx.reply(`⚠️ Вы находитесь в поиске подходящего противника.
Интерфейс заблокирован`, {
            reply_markup: new InlineKeyboard()
                .text("🚫 Отмена", "game match cancel")
        })
    }

    if (userInMatch) {
        if (ctx?.callbackQuery?.data !== undefined) {
            return ctx.reply(`⚠️ Вы находитесь в матче!\nОжидайте генерации картинки`)
        }

        const threeMinutesAgo = new Date(Date.now() - 3 * 60 * 1000);

        const match = await matchRepository
            .createQueryBuilder("match")
            .leftJoinAndSelect("match.player1", "player1")
            .leftJoinAndSelect("match.player2", "player2")
            .where("match.created_at >= :time", { time: threeMinutesAgo })
            .andWhere("match.status IN (:...statuses)", {
                statuses: [MatchStatus.WAIT_PROMPTS, MatchStatus.QUEUE]
            })
            .andWhere(
                "(player1.id = :userId OR player2.id = :userId)",
                { userId: ctx.user.id }
            )
            .orderBy("match.created_at", "DESC")
            .getOne();

        if (match.status === MatchStatus.QUEUE) {
            return ctx.reply(`⚠️ Вы находитесь в матче!\nОжидайте генерации картинки`)
        }

        if (match.status === MatchStatus.WAIT_PROMPTS) {
            if (ctx.message.text && ctx.message.text.length < 220) {
                return setMatchPrompt(ctx,match,ctx.message.text)
            } else {
                return ctx.reply(`⚠️ Введите текст который содержит не больше 220 символов.`)
            }
        }

    }

    return next()
}