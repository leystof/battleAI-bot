import {Composer, InputFile, Keyboard} from "grammy";
import {Context} from "@/database/models/context";
import {arMoney} from "@/services/ARMoney";
import {bot} from "@/utils/bot";

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
        .persistent()
}
async function start(ctx: Context) {
    return ctx.reply(text(),{
        reply_markup: startKeyb()
    })
}

export async function firstStart(ctx: Context) {
    return ctx.replyWithPhoto(new InputFile("assets/img/firstStart.png"),{
        caption: `
🎮 <b>Добро пожаловать в BattleAI!</b>

BattleAI - это увлекательная игра, где вы соревнуетесь с другими игроками в описании AI-сгенерированных изображений и зарабатываете реальные деньги.

<b>Как играть:</b>
1️⃣ Выберите сумму ставки
2️⃣ Дождитесь соперника с такой же ставкой
3️⃣ Опишите сгенерированное изображение максимально точно
4️⃣ Игрок с наиболее точным описанием выигрывает ставку соперника

✅ Вывод средств: выигрывайте и выводите реальные деньги

Начните играть прямо сейчас, нажав кнопку "🎮 Играть"!
        `,
        reply_markup: startKeyb()
    })
}
