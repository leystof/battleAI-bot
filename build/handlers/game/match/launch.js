"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const instance_1 = require("../../../modules/pool/instance");
const match_1 = require("../../../database/models/match");
const createGame_1 = require("../../../handlers/game/match/prompt/createGame");
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery(/game launch (\d+) (tag|prompt)/, start);
const text = (ctx) => {
    return `<b>⏳ Ожидание соперника</b>

Вы сделали ставку ${ctx.match[1]} ₽.
Ожидаем подходящего соперника...`;
};
const keyb = (ctx) => {
    return new grammy_1.InlineKeyboard()
        .text("🚫 Отмена", "game match cancel");
};
async function start(ctx) {
    if (ctx.user.balance < Number(ctx.match[1])) {
        return insufficientBalance(ctx);
    }
    instance_1.pool.addPlayer({
        userId: ctx.user.id,
        tgId: ctx.user.tgId,
        bet: Number(ctx.match[1]),
        type: match_1.MatchType.PROMPT,
        joinedAt: Date.now()
    });
    const pair = await instance_1.pool.getReadyPair();
    if (!pair) {
        return ctx.editMessageText(text(ctx), {
            reply_markup: keyb(ctx)
        });
    }
    (0, createGame_1.createImagePromptGame)(ctx, pair);
}
async function insufficientBalance(ctx) {
    return ctx.reply(`У вас недостаточно денег на счету, пополните баланс.`, {
        reply_markup: new grammy_1.InlineKeyboard()
            .text("💰 Пополнить баланс", "balance menu")
    });
}
