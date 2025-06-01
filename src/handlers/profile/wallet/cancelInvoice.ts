import {Composer, InlineKeyboard} from "grammy";
import {Context} from "@/database/models/context";
import {arMoney} from "@/services/ARMoney";
import {Transaction} from "@/database/models/transaction";
import {transactionRepository} from "@/database";
import {TransactionStatus} from "@/database/models/interfaces/transaction";

export const composer = new Composer<Context>()
composer.callbackQuery(/wallet cancel invoice (.+)/, start)

const text = (ctx: Context,tx: Transaction) => {
    return `🏷 ID: ${tx.externalId}

<b>Платеж отменен.</b>`
}

const keyb = (ctx: Context) => {
    return new InlineKeyboard()
}
async function start(ctx) {
    const tx = await transactionRepository.findOne({
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
    tx.status = TransactionStatus.USER_CANCELLED
    await transactionRepository.save(tx)

    return ctx.editMessageText(text(ctx,tx),{
        reply_markup: keyb(ctx)
    })
}
