import {Composer, InlineKeyboard, Keyboard} from "grammy";
import {Context} from "@/database/models/context";
import {UserStatus} from "@/database/models/user";

export const composer = new Composer<Context>()
composer.callbackQuery(/game choose bet (tag|prompt)/, start)

const text = (ctx: Context) => {
    return `${(ctx.match[1] === "tag") ? '🏷 Тэг' : '📝 Промпт'} режим выбран!

💰<b> Выберите размер ставки:</b>`
}

const keyb = (ctx: Context) => {
    return new InlineKeyboard()
        .text("100 ₽", `game launch 100 ${ctx.match[1]}`).row()
        .text("500 ₽", `game launch 500 ${ctx.match[1]}`).row()
        .text("1000 ₽", `game launch 1000 ${ctx.match[1]}`).row()
        .text("5000 ₽", `game launch 5000 ${ctx.match[1]}`).row()
        .text("🔙 Назад", "game menu")
}
async function start(ctx) {
    return ctx.editMessageText(text(ctx),{
        reply_markup: keyb(ctx)
    })
}
