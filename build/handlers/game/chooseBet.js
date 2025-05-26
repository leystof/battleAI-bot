"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery(/game choose bet (tag|prompt)/, start);
const text = (ctx) => {
    return `${(ctx.match[1] === "tag") ? '🏷 Тэг' : '📝 Промпт'} режим выбран!

💰<b> Выберите размер ставки:</b>`;
};
const keyb = (ctx) => {
    console.log(ctx.match);
    return new grammy_1.InlineKeyboard()
        .text("100 ₽", `game launch 100 ${ctx.match[1]}`).row()
        .text("500 ₽", `game launch 500 ${ctx.match[1]}`).row()
        .text("1000 ₽", `game launch 1000 ${ctx.match[1]}`).row()
        .text("5000 ₽", `game launch 5000 ${ctx.match[1]}`).row()
        .text("🔙 Назад", "game menu");
};
async function start(ctx) {
    return ctx.editMessageText(text(ctx), {
        reply_markup: keyb(ctx)
    });
}
