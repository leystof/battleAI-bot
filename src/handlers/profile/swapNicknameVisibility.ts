import {Composer, InlineKeyboard} from "grammy";
import {Context} from "@/database/models/context";
import {UserStatus} from "@/database/models/user";

export const composer = new Composer<Context>()
composer.callbackQuery('profile swap nickname visibility', start)

const text = (ctx: Context) => {
    return ``
}

const keyb = (ctx: Context) => {
    return new InlineKeyboard()
        .text('Закрыть', "deleteMessage").row()
}
async function start(ctx) {


    return ctx.reply(text(ctx),{
        reply_markup: keyb(ctx)
    })
}
