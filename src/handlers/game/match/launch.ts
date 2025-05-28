import {Composer, InlineKeyboard} from "grammy";
import {Context} from "@/database/models/context";
import {pool} from "@/modules/pool/instance";
import {MatchType} from "@/database/models/match";
import {createImagePromptGame} from "@/handlers/game/match/prompt/createGame";

export const composer = new Composer<Context>()
composer.callbackQuery(/game launch (\d+) (tag|prompt)/, start)

const text = (ctx: Context) => {
    return `<b>⏳ Ожидание соперника</b>

Вы сделали ставку ${ctx.match[1]} ₽.
Ожидаем подходящего соперника...`
}

const keyb = (ctx: Context) => {
    return new InlineKeyboard()
        .text("🚫 Отмена", "game match cancel")
}
async function start(ctx: Context) {
    if (ctx.user.balance < Number(ctx.match[1])) {
        return insufficientBalance(ctx)
    }

    pool.addPlayer({
        userId: ctx.user.id,
        tgId: ctx.user.tgId,
        bet: Number(ctx.match[1]),
        type: MatchType.PROMPT,
        joinedAt: Date.now()
    })

    const pair = await pool.getReadyPair()
    if (!pair) {
        return ctx.editMessageText(text(ctx),{
            reply_markup: keyb(ctx)
        })
    }

    createImagePromptGame(ctx, pair)
}

async function insufficientBalance(ctx: Context) {
    return ctx.reply(`У вас недостаточно денег на счету, пополните баланс.`, {
        reply_markup: new InlineKeyboard()
            .text("💰 Пополнить баланс", "balance menu")
    })
}
