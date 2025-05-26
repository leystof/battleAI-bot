import {Composer, InlineKeyboard} from "grammy";
import {Context} from "@/database/models/context";
import {UserStatus} from "@/database/models/user";

export const composer = new Composer<Context>()
composer.hears('🎮 Играть', start)
composer.callbackQuery('game menu', startCallback)

const text = (ctx: Context) => {
    return `🎮 <b>Выберите режим игры:</b>`
}

const keyb = (ctx: Context) => {
    return new InlineKeyboard()
        .text("📝 Промпт режим", "game choose bet prompt").row()
        .text("🏷 Тэг режим", "game choose bet tag").row()
        .text("⁉️ Что это?", "game help").row()
}
async function start(ctx) {
    return ctx.reply(text(ctx),{
        reply_markup: keyb(ctx)
    })
}

async function startCallback(ctx) {
    return ctx.editMessageText(text(ctx),{
        reply_markup: keyb(ctx)
    })
}
