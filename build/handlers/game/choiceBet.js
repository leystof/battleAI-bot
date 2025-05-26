"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
exports.composer = new grammy_1.Composer();
exports.composer.hears('🎮 Играть', start);
const text = (ctx) => {
    return `🎮 <b>Выберите режим игры:</b>`;
};
const keyb = (ctx) => {
    return new grammy_1.InlineKeyboard()
        .text("📝 Промпт режим", "").row()
        .text("🏷 Тэг режим", "").row()
        .text("⁉️ Что это?", "").row();
};
async function start(ctx) {
    return ctx.reply(text(ctx), {
        reply_markup: keyb(ctx)
    });
}
