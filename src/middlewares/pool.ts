import {InlineKeyboard, NextFunction} from 'grammy'
import {matchRepository} from "@/database";
import {pool} from "@/modules/pool/instance";
import {Context} from "@/database/models/context";
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
                statuses: [MatchStatus.WAIT_PROMPTS, MatchStatus.QUEUE, MatchStatus.ANALYZE]
            })
            .andWhere(
                "(player1.id = :userId OR player2.id = :userId)",
                { userId: ctx.user.id }
            )
            .orderBy("match.created_at", "DESC")
            .getOne();


        if (!match) {
            pool.markGameFinished(ctx.user.id, ctx.user.id)
            return next()
        }

        if (match.status === MatchStatus.QUEUE) {
            return ctx.reply(`⚠️ Вы находитесь в матче!\nОжидайте генерации картинки`)
        }

        if (match.status === MatchStatus.ANALYZE) {
            return ctx.reply(`<b>Идет анализ промптов, ожидайте результата игры.</b>`)
        }

        if (match.status === MatchStatus.WAIT_PROMPTS) {
            const isText = ctx.message?.text && typeof ctx.message.text === "string";
            const blockedIncludes = ["🎮 Играть", "👤 Профиль", "💰 Пополнить", "❓ Правила", "📢 Каналы", "/start", "/admin"]; // дополни при необходимости

            const text = ctx.message?.text ?? "";

            const isBlockedText =
                !isText ||
                text.startsWith("/") ||
                text.length > 220 ||
                blockedIncludes.some(word => text.toLowerCase().includes(word.toLowerCase()));

            if (isBlockedText) {
                return ctx.reply(`⚠️ Сейчас принимается только обычный текст до 220 символов без команд, кнопок и лишних слов.`);
            }

            return setMatchPrompt(ctx,match,ctx.message.text)
        }

    }

    return next()
}