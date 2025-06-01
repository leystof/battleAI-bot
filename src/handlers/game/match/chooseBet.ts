import {Composer, InlineKeyboard, Keyboard} from "grammy";
import {Context} from "@/database/models/context";

export const composer = new Composer<Context>()
composer.callbackQuery(/game choose bet (tag|prompt)/, chooseBetPromptMatch)

const text = (ctx: Context) => {
    return `<b> Выберите размер ставки:</b>`
}

const keyb = (ctx: Context) => {
    return new InlineKeyboard()
        .text("100 ₽", `game launch 100 prompt`).row()
        .text("500 ₽", `game launch 500 prompt`).row()
        .text("1000 ₽", `game launch 1000 prompt`).row()
        .text("5000 ₽", `game launch 5000 prompt`).row()
        .text("Закрыть", "deleteMessage")
        // .text("🔙 Назад", "game menu")
}
export async function chooseBetPromptMatch(ctx) {
    return ctx.reply(text(ctx),{
        reply_markup: keyb(ctx)
    })
}
