import {Composer, InlineKeyboard} from "grammy";
import {Context} from "@/database/models/context";
import {pool} from "@/modules/pool/instance";
import {MatchType} from "@/database/models/game/match";

export const composer = new Composer<Context>()
composer.callbackQuery(/game match cancel/, start)

const text = (ctx: Context) => {
    return `<b>Поиск матча был отменен</b>`
}

const keyb = (ctx: Context) => {
    return new InlineKeyboard()
        .text("🎮 Играть", "game menu")
}
async function start(ctx: Context) {
    pool.removePlayer(ctx.user.id)

    return ctx.editMessageText(text(ctx),{
        reply_markup: keyb(ctx)
    })
}
