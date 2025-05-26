"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.poolMiddleware = void 0;
const grammy_1 = require("grammy");
const instance_1 = require("../modules/pool/instance");
const poolMiddleware = async (ctx, next) => {
    const userInPool = instance_1.pool.isInPool(ctx.user.id);
    const userInMatch = instance_1.pool.isInMatch(ctx.user.id);
    if (userInPool && ctx?.callbackQuery?.data !== "game match cancel") {
        return ctx.reply(`⚠️ Вы находитесь в поиске подходящего противника.
Интерфейс заблокирован`, {
            reply_markup: new grammy_1.InlineKeyboard()
                .text("🚫 Отмена", "game match cancel")
        });
    }
    if (userInMatch) {
        if (ctx?.callbackQuery?.data !== undefined) {
            return ctx.reply(`⚠️ Вы находитесь в матче!\nОжидайте генерации картинки`);
        }
    }
    return next();
};
exports.poolMiddleware = poolMiddleware;
