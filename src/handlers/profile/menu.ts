import {Composer, InlineKeyboard} from "grammy";
import {Context} from "@/database/models/context";
import {UserStatus} from "@/database/models/user/user";
import {formatIntWithDot} from "@/helpers/formatIntWithDot";
import {getWinPercent} from "@/helpers/winPercent";
import {cryptomus} from "@/services/payments/cryptomus";
import {Config} from "@/database/models/config";
import {getCachedConfig} from "@/modules/cache/config";
import {arMoney} from "@/services/payments/ARMoney";

export const composer = new Composer<Context>()
composer.hears('👤 Профиль', profileMenu)
composer.callbackQuery('profile menu', profileMenuCallback)

const text = (ctx: Context, configDb: Config) => {
    return `👤 Ваш профиль

ID: ${ctx.user.id}
Имя: ${ctx.from.first_name}
Баланс: ${formatIntWithDot(ctx.user.balance)} ${configDb.currencyName}
На выводе: ${formatIntWithDot(ctx.user.reservedBalance)} ${configDb.currencyName}
Статус аккаунта: ${(ctx.user.status === UserStatus.ACTIVE) ? '✅ Активен' : '🟥 Заблокирован'}
Отображение никнейма: ${(ctx.user.usernameVisibility) ? '👁 Виден' : '🙈 Скрыт'}

📊 Статистика
Игр сыграно: ${Number(ctx.user.totalWin) + Number(ctx.user.totalLose)}
Побед: ${Number(ctx.user.totalWin)}
Процент побед: ${getWinPercent(Number(ctx.user.totalWin),Number(ctx.user.totalLose))}%
Всего заработано: ${Number(ctx.user.totalWinAmount)} ${configDb.currencyName}`
}

const keyb = (ctx: Context) => {
    return new InlineKeyboard()
        .text('💰 Мой кошелек', "wallet menu").row()
        .text((ctx.user.usernameVisibility) ? '🙈 Скрыть никнейм' : '👁 Открыть никнейм', "profile swap nickname visibility").row()
        // .text("👥 Реферальная программа", "refferal menu")
}
export async function profileMenu(ctx) {
    try {
        await cryptomus.testCallback({
            uuid: "77e0eff6-8208-4791-bd4a-e43bdccc8f1e",
            status: "paid",
            currency: "USDT",
            network: "BSC",
        })
    }catch (e) {
        console.log(e)
    }
    // try {
    //     await arMoney.testPaid("bc9fd174-0980-45f6-8c43-3229b6a47f35")
    // }catch (e) {
    //     console.log(e)
    // }
    // try {
    //     const cr = await cryptomus.createInvoice({
    //         amount: "25000",
    //         currency: "USD",
    //         is_payment_multiple: false,
    //         subtract: 100,
    //         order_id: "123а23"
    //     })
    //
    //     console.log(cr)
    // } catch (e) {
    //     console.log(e)
    // }

    return ctx.reply(text(ctx, await getCachedConfig()),{
        reply_markup: keyb(ctx)
    })
}

export async function profileMenuCallback(ctx) {


    return ctx.editMessageText(text(ctx,await getCachedConfig()),{
        reply_markup: keyb(ctx)
    })
}
