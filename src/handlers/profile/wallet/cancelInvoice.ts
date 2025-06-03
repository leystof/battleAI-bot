import {Composer, InlineKeyboard} from "grammy";
import {Context} from "@/database/models/context";
import {arMoney} from "@/services/payments/ARMoney";
import {Transaction} from "@/database/models/payments/transaction";
import {armoneyRepository, transactionRepository} from "@/database";
import {ARMoneyTransactionStatus} from "@/database/models/payments/interfaces/armoney";
import {Armoney} from "@/database/models/payments/armoney";

export const composer = new Composer<Context>()
composer.callbackQuery(/wallet cancel invoice (.+)/, start)

const text = (ctx: Context,tx: Armoney) => {
    return `🏷 ID: ${tx.externalId}

<b>Платеж отменен.</b>`
}

const keyb = (ctx: Context) => {
    return new InlineKeyboard()
}
async function start(ctx) {
    const tx = await armoneyRepository.findOne({
        where: {
            externalId: ctx.match[1]
        }
    })

    if (!tx) {
        return ctx.reply(`🏷 ID: ${ctx.match[1]}\n\n<b>Транзакция не найдена.</b>`)
    }

    try {
        await arMoney.cancelInvoice(ctx.match[1])
    } catch (e) {
        console.log(e);
    }
    tx.status = ARMoneyTransactionStatus.USER_CANCELLED
    await armoneyRepository.save(tx)

    return ctx.editMessageText(text(ctx,tx),{
        reply_markup: keyb(ctx)
    })
}
