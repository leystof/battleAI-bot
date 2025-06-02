import {Composer, InlineKeyboard} from "grammy";
import {Context} from "@/database/models/context";
import {UserStatus} from "@/database/models/user";
import {formatIntWithDot} from "@/helpers/formatIntWithDot";

export const composer = new Composer<Context>()
composer.callbackQuery('wallet menu', start)

const text = (ctx: Context) => {
    return `💰 Мой кошелек:
    
💵 Баланс: ${formatIntWithDot(ctx.user.balance)} ₽
💸 На выводе: ${formatIntWithDot(ctx.user.reservedBalance)} ₽
`
}

const keyb = (ctx: Context) => {
    return new InlineKeyboard()
        .text("💵 Пополнить баланс", "wallet topup provider").row()
        .text("💸 Вывести средства", "wallet withdraw").row()
        .text("🔙 Назад к профилю", "profile menu")
}
async function start(ctx) {
    return ctx.editMessageText(text(ctx),{
        reply_markup: keyb(ctx)
    })
}
