import {Composer, InlineKeyboard} from "grammy";
import {Context} from "@/database/models/context";
import {UserStatus} from "@/database/models/user/user";
import {userRepository} from "@/database";
import {profileMenu, profileMenuCallback} from "@/handlers/profile/menu";

export const composer = new Composer<Context>()
composer.callbackQuery('profile swap nickname visibility', start)

const text = (ctx: Context) => {
    return `${(ctx.user.usernameVisibility) ? 
        '<b>👁 Вы сделали свой ник видимым</b>'
    : '<b>🙈 Вы скрыли свой ник</b>'
    }`
}

const keyb = (ctx: Context) => {
    return new InlineKeyboard()
        .text('Закрыть', "deleteMessage").row()
}
async function start(ctx: Context) {

    ctx.user.usernameVisibility = (!ctx.user.usernameVisibility)
    await userRepository.save(ctx.user)

    return profileMenuCallback(ctx)
}
