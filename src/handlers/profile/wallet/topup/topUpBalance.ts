import {Composer, InlineKeyboard} from "grammy";
import {Context} from "@/database/models/context";
import {createInvoiceRub, preInvoiceRub} from "@/handlers/profile/wallet/topup/currency/rub";
import {createInvoiceUsdt, preInvoiceUsdt} from "@/handlers/profile/wallet/topup/currency/usdt";

export const composer = new Composer<Context>()
composer.callbackQuery(/^wallet topup provider (.+) (\d+) create$/, createInvoice)
composer.callbackQuery(/^wallet topup provider (.+) (\d+)$/, preCreateInvoice)
composer.callbackQuery(/^wallet topup provider (.+)$/, chooseAmount)

const text = (ctx: Context) => {
    return `<b>Выберите сумму:</b>`
}

const keyb = (ctx: Context, currency: "rub" | "crypto") => {
    const keyb = new InlineKeyboard()

    if (currency === 'rub') {
        keyb.text("500 ₽", "wallet topup provider rub 500").row()
        keyb.text("1000 ₽", "wallet topup provider rub 1000").row()
        keyb.text("2000 ₽", "wallet topup provider rub 2000").row()
        keyb.text("5000 ₽", "wallet topup provider rub 5000").row()
        keyb.text("Своя сумма", "wallet topup rub another").row()
    }

    if (currency === 'crypto') {
        keyb.text("7 $", "wallet topup provider crypto 7").row()
        keyb.text("15 $", "wallet topup provider crypto 15").row()
        keyb.text("70 $", "wallet topup provider crypto 70").row()
        keyb.text("100 $", "wallet topup provider crypto 100").row()
        keyb.text("Своя сумма", "wallet topup crypto another").row()
    }

    keyb.text("🔙 Способы пополнения", "wallet topup provider")
    return keyb
}
async function chooseAmount(ctx) {
    return ctx.editMessageText(text(ctx),{
        reply_markup: keyb(ctx, ctx.match[1])
    })
}

async function createInvoice(ctx: Context) {
    const provider = ctx.match[1]
    console.log(provider)
    if (provider === "rub") {
        return createInvoiceRub(ctx)
    }
    if (provider === "crypto") {
        return createInvoiceUsdt(ctx)
    }
}
async function preCreateInvoice(ctx: Context) {
    const provider = ctx.match[1]
    if (provider === "rub") {
        return preInvoiceRub(ctx)
    }
    if (provider === "crypto") {
        return preInvoiceUsdt(ctx)
    }
}

