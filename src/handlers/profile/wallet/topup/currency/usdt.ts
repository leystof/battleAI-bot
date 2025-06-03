import {Context} from "@/database/models/context";
import {getCachedConfig} from "@/modules/cache/config";
import {cryptomusRepository, tierProviderRepository, transactionRepository} from "@/database";
import {getPercent} from "@/helpers/getPercent";
import {ARMoneyTransactionCurrency, ARMoneyTransactionStatus} from "@/database/models/payments/interfaces/armoney";
import { v4 as uuidv4 } from 'uuid';
import {alertBot} from "@/utils/bot";
import {getUsername} from "@/helpers/getUsername";
import {Transaction} from "@/database/models/payments/transaction";
import {cryptomus} from "@/services/payments/cryptomus";
import {CryptomusInvoicePayload, CryptomusInvoiceResponse} from "@/services/payments/cryptomus/interfaces";
import {TransactionStatus, TransactionType} from "@/database/models/payments/interfaces/transaction";
import {Cryptomus} from "@/database/models/payments/cryptomus";
import {CryptomusStatus} from "@/database/models/payments/interfaces/cryptomus";

export async function preInvoiceUsdt(ctx: Context) {
    const provider = ctx.match[1]
    const amount = Number(ctx.match[2])
    const config = await getCachedConfig()
    const tier = await tierProviderRepository.findOne({where: {provider: config.paymentUsdtProvider},})

    if (amount < config.paymentUsdtProvider.minTopUp) {
        return ctx.reply(`<b>Минимальная сумма пополнения:</b> ${config.paymentUsdtProvider.minTopUp} USDT`)
    }

    return ctx.editMessageText(`
💰 <b>Подтверждение пополнения</b>

💳 <b>К оплате:</b> ${amount} USDT
💵 <b>Поступит на баланс:</b> ${amount - getPercent(amount,tier.percent)} ${config.currencyName}

После успешной оплаты средства автоматически поступят на ваш игровой баланс.

Продолжить пополнение?`, {
        reply_markup: {
            inline_keyboard: [
                [{text: "💳 Оплатить", callback_data: `wallet topup provider ${provider} ${amount} create`}],
            ]
        }
    })
}

export async function createInvoiceUsdt(ctx: Context) {
    const configDb = await getCachedConfig()
    console.log(123)
    const tier = await tierProviderRepository.findOne({where: {provider: configDb.paymentUsdtProvider}})

    const amount = Number(ctx.match[2])
    await ctx.editMessageText(`⏳️️️️️️️ Создание ссылки для оплаты...`, {
        reply_markup: {
            inline_keyboard: []
        }
    })

    const operationId = uuidv4()
    let createInvoice: CryptomusInvoiceResponse
    try {
        createInvoice = await cryptomus.createInvoice({
            amount: String(amount),
            currency: "USD",
            is_payment_multiple: false,
            subtract: 100,
            order_id: operationId
        })
    } catch (e) {
        try {
            await alertBot.api.sendMessage(configDb.channelInvoiceId, `
#ERROR_CREATE_PAYMENT

<b>${configDb.paymentUsdtProvider.name.toUpperCase()}</b>
<b>Operation ID:</b> ${operationId}
<b>Пользователь:</b> ${await getUsername(ctx.user)}
<b>ID:</b> ${ctx.user.id}
<pre>${e.toString()}</pre>
        `, {
                parse_mode: "HTML"
            })
        } catch (e) {console.log(e)}
        return ctx.editMessageText("Ошибка при создании платежа.")
    }



    const newTx = new Cryptomus()
    newTx.externalId = operationId
    newTx.user = ctx.user
    newTx.userId = ctx.user.id
    newTx.amount = Number(amount)
    newTx.percentProvider = tier.percent
    newTx.type = TransactionType.TOP_UP
    newTx.status = CryptomusStatus.CONFIRM_CHECK
    newTx.currency = ARMoneyTransactionCurrency.USDT

    await cryptomusRepository.save(newTx)
    return ctx.editMessageText(`
🏷 ID: ${newTx.externalId}

<b>Перейдите на страницу оплаты</b>`,{
        reply_markup: {
            inline_keyboard: [
                [{text: "💳 Перейти на страницу оплаты", url: `${createInvoice["url"]}`}]
            ]
        }
    })
}

