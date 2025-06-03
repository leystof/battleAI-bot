import {Composer, InlineKeyboard} from "grammy";
import {Context} from "@/database/models/context";
import {UserStatus} from "@/database/models/user/user";
import {formatIntWithDot} from "@/helpers/formatIntWithDot";
import {getCachedConfig} from "@/modules/cache/config";

export const composer = new Composer<Context>()
composer.callbackQuery('wallet menu', start)

const text = async (ctx: Context) => {
    const configDb = await getCachedConfig()
    return `💰 Мой кошелек:
    
💵 Баланс: ${formatIntWithDot(ctx.user.balance)} ${configDb.currencyName}
💸 На выводе: ${formatIntWithDot(ctx.user.reservedBalance)} ${configDb.currencyName}
`
}

const keyb = (ctx: Context) => {
    return new InlineKeyboard()
        .text("💵 Пополнить баланс", "wallet topup provider").row()
        .text("💸 Вывести средства", "wallet withdraw").row()
        .text("🔙 Назад к профилю", "profile menu")
}
async function start(ctx) {
    return ctx.editMessageText(await text(ctx),{
        reply_markup: keyb(ctx)
    })
}
