"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
exports.composer = new grammy_1.Composer();
exports.composer.hears('🎮 Играть', start);
exports.composer.callbackQuery('game menu', startCallback);
const text = (ctx) => {
    return `🎮 <b>Выберите режим игры:</b>`;
};
const keyb = (ctx) => {
    return new grammy_1.InlineKeyboard()
        .text("📝 Промпт режим", "game choose bet prompt").row()
        // .text("🏷 Тэг режим", "game choose bet tag").row()
        .text("⁉️ Что это?", "game help").row();
};
async function start(ctx) {
    return ctx.reply(text(ctx), {
        reply_markup: keyb(ctx)
    });
}
async function startCallback(ctx) {
    return ctx.editMessageText(text(ctx), {
        reply_markup: keyb(ctx)
    });
}
