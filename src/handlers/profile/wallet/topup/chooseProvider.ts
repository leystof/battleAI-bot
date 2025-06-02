import {Composer, InlineKeyboard, Keyboard} from "grammy";
import {Context} from "@/database/models/context";
export const composer = new Composer<Context>()
composer.callbackQuery(/^wallet topup provider$/, startCallback)
composer.hears('💰 Пополнить', start)

const text = () => {
    return `<b>Выберите способ пополнения</b>`
}

const keyb = () => {
    return new InlineKeyboard()
        .text("RUB", "wallet topup provider rub").row()
        .text("Криптовалюта", "wallet topup provider crypto").row()
        .text("🔙 Назад к кошельку", "wallet menu")
}
async function start(ctx) {
    return ctx.reply(text(),{
        reply_markup: keyb()
    })
}

async function startCallback(ctx) {
    return ctx.editMessageText(text(),{
        reply_markup: keyb()
    })
}
