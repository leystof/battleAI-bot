import {Composer, InlineKeyboard} from "grammy";
import {Context} from "@/database/models/context";
import {UserStatus} from "@/database/models/user";
import {formatIntWithDot} from "@/helpers/formatIntWithDot";

export const composer = new Composer<Context>()
composer.callbackQuery('wallet menu', start)

const text = (ctx: Context) => {
    return `<b>Выберите сумму:</b>`
}

const keyb = (ctx: Context) => {
    return new InlineKeyboard()
        .text("500 ₽", "wallet topup 500").row()
        .text("100 ₽", "wallet topup 1000").row()
        .text("2000 ₽", "wallet topup 2000").row()
        .text("5000 ₽", "wallet topup 5000").row()
        .text("🔙 Назад к кошельку", "wallet menu")
}
async function start(ctx) {
    return ctx.editMessageText(text(ctx),{
        reply_markup: keyb(ctx)
    })
}
