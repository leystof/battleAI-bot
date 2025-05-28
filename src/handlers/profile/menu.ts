import {Composer, InlineKeyboard} from "grammy";
import {Context} from "@/database/models/context";
import {UserStatus} from "@/database/models/user";

export const composer = new Composer<Context>()
composer.hears('👤 Профиль', start)

const text = (ctx: Context) => {
    return `👤 Ваш профиль

ID: ${ctx.user.id}
Имя: ${ctx.from.first_name}
Баланс: ${ctx.user.balance} ₽
На выводе: 0 ₽
Статус аккаунта: ${(ctx.user.status === UserStatus.ACTIVE) ? '✅ Активен' : '🟥 Заблокирован'}
Отображение никнейма: ${(ctx.user.usernameVisibility) ? '👁 Виден' : '🙈 Скрыт'}

📊 Статистика
Игр сыграно: 0
Побед: 0
Процент побед: 0%
Всего заработано: 0 ₽`

}

const keyb = (ctx: Context) => {
    return new InlineKeyboard()
        .text((ctx.user.usernameVisibility) ? '🙈 Скрыть никнейм' : '👁 Открыть никнейм', "profile swap nickname visibility").row()
        // .text("👥 Реферальная программа", "refferal menu")
}
async function start(ctx) {
    return ctx.reply(text(ctx),{
        reply_markup: keyb(ctx)
    })
}
