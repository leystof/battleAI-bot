import {Composer, InlineKeyboard} from "grammy";
import {Context} from "@/database/models/context";
import {UserStatus} from "@/database/models/user";
import {formatIntWithDot} from "@/helpers/formatIntWithDot";

export const composer = new Composer<Context>()
composer.hears('👤 Профиль', start)
composer.callbackQuery('profile menu', startCallback)

const text = (ctx: Context) => {
    return `👤 Ваш профиль

ID: ${ctx.user.id}
Имя: ${ctx.from.first_name}
Баланс: ${formatIntWithDot(ctx.user.balance)} ₽
На выводе: ${formatIntWithDot(ctx.user.reservedBalance)} ₽
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
        .text('💰 Мой кошелек', "wallet menu").row()
        .text((ctx.user.usernameVisibility) ? '🙈 Скрыть никнейм' : '👁 Открыть никнейм', "profile swap nickname visibility").row()
        // .text("👥 Реферальная программа", "refferal menu")
}
async function start(ctx) {
    return ctx.reply(text(ctx),{
        reply_markup: keyb(ctx)
    })
}

async function startCallback(ctx) {
    return ctx.editMessageText(text(ctx),{
        reply_markup: keyb(ctx)
    })
}
