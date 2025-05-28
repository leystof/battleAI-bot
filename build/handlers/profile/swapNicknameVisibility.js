"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery('profile swap nickname visibility', start);
const text = (ctx) => {
    return ``;
};
const keyb = (ctx) => {
    return new grammy_1.InlineKeyboard()
        .text('Закрыть', "deleteMessage").row();
};
async function start(ctx) {
    return ctx.reply(text(ctx), {
        reply_markup: keyb(ctx)
    });
}
