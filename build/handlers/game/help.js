"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery('game help', start);
const text = (ctx) => {
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
• При ничьей каждый получает 90% своей ставки`;
};
const keyb = (ctx) => {
    return new grammy_1.InlineKeyboard()
        .text("🔙 Назад", "game menu");
};
async function start(ctx) {
    return ctx.editMessageText(text(ctx), {
        reply_markup: keyb(ctx)
    });
}
