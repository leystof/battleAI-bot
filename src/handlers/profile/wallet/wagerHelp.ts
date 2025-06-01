import {Composer, InlineKeyboard, Keyboard} from "grammy";
import {Context} from "@/database/models/context";


export const composer = new Composer<Context>()
composer.callbackQuery('wager help', start)

const text = () => {
    return `<b>ℹ️ Что такое вейджер?</b>

<b>Вейджер (Wager)</b> - это требование по отыгрышу бонусных средств перед выводом.

<b>Как это работает:</b>
1. При получении бонуса (например, при депозите) устанавливается вейджер x1
2. Это означает, что вы должны сделать ставки на сумму, равную полученному бонусу
3. Каждая ваша ставка в игре учитывается в счет отыгрыша вейджера
4. После полного отыгрыша вейджера вы можете вывести средства

<b>Пример:</b>
• Вы внесли депозит 1000 ₽
• Вейджер x1 = 1000 ₽
• Вам нужно сделать ставок на 1000 ₽, чтобы иметь возможность вывести средства

Вейджер - стандартная практика в игровой индустрии, которая служит для борьбы с отмыванием денег.`
}

const keyb = () => {
    return new InlineKeyboard()
        .text("Закрыть", "deleteMessage")
}
async function start(ctx) {
    return ctx.reply(text(),{
        reply_markup: keyb()
    })
}
