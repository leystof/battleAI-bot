import {Composer, InlineKeyboard, Keyboard} from "grammy";
import {Context} from "@/database/models/context";
import {UserStatus} from "@/database/models/user";

export const composer = new Composer<Context>()
composer.callbackQuery('game help', start)

const text = (ctx: Context) => {
    return `<b>ℹ️ Информация о режимах игры:</b>

<b>📝 Промпт режим:</b>
• Вам показывается изображение
• Нужно описать его текстом за 60 секунд
• Побеждает тот, чье описание точнее

<b>🏷️ Тэг режим:</b>
• Вам показывается изображение
• Нужно выбрать 6 ключевых слов из 24 вариантов
• Побеждает тот, кто выберет больше правильных слов

<b>💰 Выплаты:</b>
• Победитель получает 90% от общего банка
• 10% - комиссия платформы
• При ничьей каждый получает 90% своей ставки`
}

const keyb = (ctx: Context) => {
    return new InlineKeyboard()
        .text("🔙 Назад", "game menu")
}
async function start(ctx) {
    return ctx.editMessageText(text(ctx),{
        reply_markup: keyb(ctx)
    })
}
