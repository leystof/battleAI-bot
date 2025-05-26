import {Composer, InlineKeyboard, Keyboard} from "grammy";
import {Context} from "@/utils/context";

export const composer = new Composer<Context>()
composer.hears('📢 Каналы', start)

const text = () => {
    return "Каналы проекта:"
}

const keyb = () => {
    return new InlineKeyboard()
        .url("🟢 Live победители", "https://t.me/BattleAI_live")
}
async function start(ctx) {
    return ctx.reply(text(),{
        reply_markup: keyb()
    })
}
