import {InlineKeyboard, NextFunction} from 'grammy'
import {log} from "@/utils/logger";
import {User} from "@/database/models/user";
import {userRepository} from "@/database";
import {pool} from "@/modules/pool/instance";
import {Context} from "@/database/models/context";

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
    }

    return next()
}