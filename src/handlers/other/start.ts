import {Composer, Keyboard} from "grammy";
import {Context} from "@/utils/context";
import {prisma} from "@/database/prisma";

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
async function start(ctx) {
    const test = await prisma.
    return ctx.reply(text(),{
        reply_markup: startKeyb()
    })
}
