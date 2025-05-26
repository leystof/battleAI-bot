"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
exports.composer = new grammy_1.Composer();
exports.composer.hears('📢 Каналы', start);
const text = () => {
    return "Каналы проекта:";
};
const keyb = () => {
    return new grammy_1.InlineKeyboard()
        .url("🟢 Live победители", "https://t.me/BattleAI_live");
};
async function start(ctx) {
    return ctx.reply(text(), {
        reply_markup: keyb()
    });
}
