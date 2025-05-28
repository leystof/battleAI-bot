"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const database_1 = require("../../database");
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery('profile swap nickname visibility', start);
const text = (ctx) => {
    return `${(ctx.user.usernameVisibility) ?
        '<b>👁 Вы сделали свой ник видимым</b>'
        : '<b>🙈 Вы скрыли свой ник</b>'}`;
};
const keyb = (ctx) => {
    return new grammy_1.InlineKeyboard()
        .text('Закрыть', "deleteMessage").row();
};
async function start(ctx) {
    ctx.user.usernameVisibility = (!ctx.user.usernameVisibility);
    await database_1.userRepository.save(ctx.user);
    return ctx.reply(text(ctx), {
        reply_markup: keyb(ctx)
    });
}
