"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startKeyb = exports.composer = void 0;
const grammy_1 = require("grammy");
exports.composer = new grammy_1.Composer();
exports.composer.command('start', start);
const text = () => {
    return "Добро пожаловать в игру ставок! Выберите действие:";
};
const startKeyb = () => {
    return new grammy_1.Keyboard()
        .text("🎮 Играть").row()
        .text("👤 Профиль")
        .text("💰 Пополнить").row()
        .text("📢 Каналы")
        .text("❓ Правила").row()
        .resized();
};
exports.startKeyb = startKeyb;
async function start(ctx) {
    return ctx.reply(text(), {
        reply_markup: (0, exports.startKeyb)()
    });
}
