"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery(/game launch (\d+) (tag|prompt)/, start);
const text = (ctx) => {
    return `${(ctx.match[1] === "tag") ? '🏷 Тэг' : '📝 Промпт'} режим выбран!

💰<b> Выберите размер ставки:</b>`;
};
const keyb = (ctx) => {
    return new grammy_1.InlineKeyboard()
        .text("🔙 Назад", "game menu");
};
async function start(ctx) {
    if (ctx.user.balance <= Number(ctx.match[1])) {
        return insufficientBalance(ctx);
    }
    return ctx.editMessageText(text(ctx), {
        reply_markup: keyb(ctx)
    });
}
async function insufficientBalance(ctx) {
    return ctx.reply(`У вас недостаточно денег на счету, пополните баланс.`, {
        reply_markup: new grammy_1.InlineKeyboard()
            .text("💰 Пополнить баланс", "balance menu")
    });
}
