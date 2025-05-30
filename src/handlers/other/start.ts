import {Composer, Keyboard} from "grammy";
import {Context} from "@/database/models/context";
import {arMoney} from "@/services/ARMoney";

export const composer = new Composer<Context>()
composer.command('start', start)

const text = () => {
    return "Добро пожаловать в игру ставок! Выберите действие:"
}

export const startKeyb = () => {
    return new Keyboard()
        .text("🎮 Играть").row()
        .text("👤 Профиль")
        .text("💰 Пополнить").row()
        .text("📢 Каналы")
        .text("❓ Правила").row()
        .resized()
}
async function start(ctx: Context) {
    return ctx.reply(text(),{
        reply_markup: startKeyb()
    })
}
