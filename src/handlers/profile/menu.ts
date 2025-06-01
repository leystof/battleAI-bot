import {Composer, InlineKeyboard} from "grammy";
import {Context} from "@/database/models/context";
import {UserStatus} from "@/database/models/user";
import {formatIntWithDot} from "@/helpers/formatIntWithDot";
import {arMoney} from "@/services/ARMoney";
import {getWinPercent} from "@/helpers/winPercent";
import {parseButtons} from "@/helpers/parseButtons";
import {getCachedConfig} from "@/modules/cache/config";

export const composer = new Composer<Context>()
composer.hears('👤 Профиль', profileMenu)
composer.callbackQuery('profile menu', profileMenuCallback)

const text = (ctx: Context) => {
    return `👤 Ваш профиль

ID: ${ctx.user.id}
Имя: ${ctx.from.first_name}
Баланс: ${formatIntWithDot(ctx.user.balance)} ₽
На выводе: ${formatIntWithDot(ctx.user.reservedBalance)} ₽
Статус аккаунта: ${(ctx.user.status === UserStatus.ACTIVE) ? '✅ Активен' : '🟥 Заблокирован'}
Отображение никнейма: ${(ctx.user.usernameVisibility) ? '👁 Виден' : '🙈 Скрыт'}

📊 Статистика
Игр сыграно: ${Number(ctx.user.totalWin) + Number(ctx.user.totalLose)}
Побед: ${Number(ctx.user.totalWin)}
Процент побед: ${getWinPercent(Number(ctx.user.totalWin),Number(ctx.user.totalLose))}%
Всего заработано: ${Number(ctx.user.totalWinAmount)} ₽`
}

const keyb = (ctx: Context) => {
    return new InlineKeyboard()
        .text('💰 Мой кошелек', "wallet menu").row()
        .text((ctx.user.usernameVisibility) ? '🙈 Скрыть никнейм' : '👁 Открыть никнейм', "profile swap nickname visibility").row()
        // .text("👥 Реферальная программа", "refferal menu")
}
export async function profileMenu(ctx) {
    // let invoiceId = "ee6a3e58-26b4-475d-8dcc-0e4875e1d7bd"
    // await fetch("http://localhost:8888/callback/armoney/invoice", {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify({
    //             invoice_id: invoiceId,
    //             state: 4,
    //             new_amount: null,
    //             amount: 1250,
    //             appeal_state: 1,
    //             appeal_reason: null,
    //             redirect_url: 'https://t.me/TonPayMaster_Bot',
    //             operation_id: ''
    //         }
    //     )
    // })
    return ctx.reply(text(ctx),{
        reply_markup: keyb(ctx)
    })
}

export async function profileMenuCallback(ctx) {


    return ctx.editMessageText(text(ctx),{
        reply_markup: keyb(ctx)
    })
}
