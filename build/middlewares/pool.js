"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.poolMiddleware = void 0;
const grammy_1 = require("grammy");
const database_1 = require("../database");
const instance_1 = require("../modules/pool/instance");
const match_1 = require("../database/models/match");
const setPrompt_1 = require("../handlers/game/match/prompt/setPrompt");
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
        const threeMinutesAgo = new Date(Date.now() - 3 * 60 * 1000);
        const match = await database_1.matchRepository
            .createQueryBuilder("match")
            .leftJoinAndSelect("match.player1", "player1")
            .leftJoinAndSelect("match.player2", "player2")
            .where("match.created_at >= :time", { time: threeMinutesAgo })
            .andWhere("match.status IN (:...statuses)", {
            statuses: [match_1.MatchStatus.WAIT_PROMPTS, match_1.MatchStatus.QUEUE, match_1.MatchStatus.ANALYZE]
        })
            .andWhere("(player1.id = :userId OR player2.id = :userId)", { userId: ctx.user.id })
            .orderBy("match.created_at", "DESC")
            .getOne();
        if (!match) {
            instance_1.pool.markGameFinished(ctx.user.id, ctx.user.id);
            return next();
        }
        if (match.status === match_1.MatchStatus.QUEUE) {
            return ctx.reply(`⚠️ Вы находитесь в матче!\nОжидайте генерации картинки`);
        }
        if (match.status === match_1.MatchStatus.ANALYZE) {
            return ctx.reply(`<b>Идет анализ промптов, ожидайте результата игры.</b>`);
        }
        if (match.status === match_1.MatchStatus.WAIT_PROMPTS) {
            if (ctx.message.text && ctx.message.text.length < 220) {
                return (0, setPrompt_1.setMatchPrompt)(ctx, match, ctx.message.text);
            }
            else {
                return ctx.reply(`⚠️ Введите текст который содержит не больше 220 символов.`);
            }
        }
    }
    return next();
};
exports.poolMiddleware = poolMiddleware;
