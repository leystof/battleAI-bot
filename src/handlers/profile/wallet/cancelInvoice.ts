import {Composer, InlineKeyboard} from "grammy";
import {Context} from "@/database/models/context";
import {arMoney} from "@/services/ARMoney";
import {ARMoneyInvoiceResponse} from "@/services/ARMoney/interfaces";
import {config} from "@/utils/config";
import {formatIntWithDot} from "@/helpers/formatIntWithDot";

export const composer = new Composer<Context>()
composer.callbackQuery(/wallet cancel invoice (.+)/, start)

const text = (ctx: Context) => {
    return `<b>Выберите сумму:</b>`
}

const keyb = (ctx: Context) => {
    return new InlineKeyboard()
        .text("500 ₽", "wallet topup 500").row()
        .text("1000 ₽", "wallet topup 1000").row()
        .text("2000 ₽", "wallet topup 2000").row()
        .text("5000 ₽", "wallet topup 5000").row()
        .text("🔙 Назад к кошельку", "wallet menu")
}
async function start(ctx) {
    const res = await arMoney.cancelInvoice(ctx.match[1])

    console.log(res)
    return ctx.reply(text(ctx),{
        reply_markup: keyb(ctx)
    })
}
