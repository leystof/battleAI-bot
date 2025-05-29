import {Composer, InlineKeyboard} from "grammy";
import {Context} from "@/database/models/context";
import {arMoney} from "@/services/ARMoney";
import {ARMoneyInvoiceResponse} from "@/services/ARMoney/interfaces";
import {config} from "@/utils/config";
import {formatIntWithDot} from "@/helpers/formatIntWithDot";
import {
    TransactionCurrency,
    TransactionSource,
    TransactionStatus,
    TransactionType
} from "@/database/models/interfaces/transaction";
import {transactionRepository} from "@/database";
import {Transaction} from "@/database/models/transaction";
import {getPercent} from "@/helpers/getPercent";

export const composer = new Composer<Context>()
composer.callbackQuery('wallet topup', chooseAmount)
composer.callbackQuery(/wallet topup (\d+)/, createOrder)

const text = (ctx: Context) => {
    return `<b>Выберите сумму:</b>`
}

const keyb = (ctx: Context) => {
    return new InlineKeyboard()
        .text("500 ₽", "wallet topup 500").row()
        .text("1000 ₽", "wallet topup 1000").row()
        .text("2000 ₽", "wallet topup 2000").row()
        .text("5000 ₽", "wallet topup 5000").row()
        .text("🔙 Назад к кошельку", "wallet menu")
}
async function chooseAmount(ctx) {
    return ctx.editMessageText(text(ctx),{
        reply_markup: keyb(ctx)
    })
}

async function createOrder(ctx: Context) {
    const amount = Number(ctx.match[1])
    await ctx.editMessageText(`⏳️️️️️️️ Создание ссылки для оплаты...`, {
        reply_markup: {
            inline_keyboard: []
        }
    })

    const createInvoice: ARMoneyInvoiceResponse | {error: string} = await arMoney.createInvoice({
        amount: amount,
        operation_id: "",
        pair: "USDT-RUB",
        redirect_url: `https://t.me/${ctx.me.username}`,
    })

    if (createInvoice["error"]) {
        return ctx.editMessageText("Ошибка при создании платежа.")
    }

    const newTx = new Transaction()
    newTx.externalId = createInvoice["id"]
    newTx.user = ctx.user
    newTx.amount = Number(createInvoice["amount"])
    newTx.percentProvider = 11.5
    newTx.type = TransactionType.TOP_UP
    newTx.status = TransactionStatus.CREATE
    newTx.source = TransactionSource.ARMONEY
    newTx.currency = TransactionCurrency.RUB

    await transactionRepository.save(newTx)
    return ctx.editMessageText(`🏷 <b>Платеж сгенерирован:</b>
 
<b>ID:</b> <code>${createInvoice["id"]}</code>
<b>Сумма к оплате:</b> <code>${formatIntWithDot(createInvoice["amount"])} ₽</code>
<b>Сумма которая будет зачислена:</b> <code>${formatIntWithDot(Number(createInvoice["amount"]) - getPercent(Number(createInvoice["amount"]), newTx.percentProvider))} ₽</code>
`, {
        reply_markup: {
            inline_keyboard: [
                [{text: "💳 Оплатить", url: `${config.armoney.payUrl}/${createInvoice["id"]}`}],
            ]
        }
    })
}
