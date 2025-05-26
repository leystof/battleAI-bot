"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const instance_1 = require("../../../modules/pool/instance");
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery(/game match cancel/, start);
const text = (ctx) => {
    return `<b>Поиск матча был отменен</b>`;
};
const keyb = (ctx) => {
    return new grammy_1.InlineKeyboard()
        .text("🎮 Играть", "game menu");
};
async function start(ctx) {
    instance_1.pool.removePlayer(ctx.user.id);
    return ctx.editMessageText(text(ctx), {
        reply_markup: keyb(ctx)
    });
}
