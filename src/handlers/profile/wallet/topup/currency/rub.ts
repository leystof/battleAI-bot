import {Context} from "@/database/models/context";
import {getCachedConfig} from "@/modules/cache/config";
import {armoneyRepository, tierProviderRepository, transactionRepository} from "@/database";
import {getPercent} from "@/helpers/getPercent";
import {rubToUsdt} from "@/helpers/payments/rubToUsdt";
import {
    ARMoneyTransactionCurrency,
    ARMoneyTransactionStatus,
} from "@/database/models/payments/interfaces/armoney";
import {MoreThan} from "typeorm";
import {v4 as uuidv4} from "uuid";
import {arMoney} from "@/services/payments/ARMoney";
import {alertBot} from "@/utils/bot";
import {getUsername} from "@/helpers/getUsername";
import {Transaction} from "@/database/models/payments/transaction";
import {config} from "@/utils/config";
import {TransactionType} from "@/database/models/payments/interfaces/transaction";
import {Armoney} from "@/database/models/payments/armoney";

export async function preInvoiceRub(ctx: Context) {
    const provider = ctx.match[1]
    const amount = Number(ctx.match[2])
    const config = await getCachedConfig()
    const tier = await tierProviderRepository.findOne({where: {provider: config.paymentRubProvider},})

    if (amount < config.paymentRubProvider.minTopUp) {
        return ctx.reply(`<b>Минимальная сумма пополнения:</b> ${config.paymentRubProvider.minTopUp} ₽`)
    }

    return ctx.editMessageText(`
💰 <b>Подтверждение пополнения</b>

💳 <b>К оплате:</b> ${amount} ₽
💵 <b>Поступит на баланс:</b> ${await rubToUsdt(amount, {percent: tier.percent, extraPercent: tier.extraPercent, source: config.paymentRubProvider.name as undefined})} ${config.currencyName}

После успешной оплаты средства автоматически поступят на ваш игровой баланс.

Продолжить пополнение?`, {
        reply_markup: {
            inline_keyboard: [
                [{text: "💳 Оплатить", callback_data: `wallet topup provider ${provider} ${amount} create`}],
            ]
        }
    })
}

export async function createInvoiceRub(ctx: Context) {
    const configDb = await getCachedConfig()
    const amount = Number(ctx.match[2])

    const tx = await armoneyRepository.findOne({
        where: {
            user: {
                id: ctx.user.id
            },
            type: TransactionType.TOP_UP,
            status: ARMoneyTransactionStatus.CREATE,
            created_at: MoreThan(new Date(Date.now() - 60 * 60 * 1000)) // 1 hour
        }, relations: ["user"]
    })

    if (tx) {
        return ctx.reply(`🏷 ID: ${tx.externalId}

<b>Завершите предыдущий платеж</b>
        `, {
            reply_markup: {
                inline_keyboard: [
                    [{text: "🚫 Отменить", callback_data: `wallet cancel invoice ${tx.externalId}`}],
                ]
            }
        })
    }
    const tier = await tierProviderRepository.findOne({where: {provider: configDb.paymentRubProvider}})

    await ctx.editMessageText(`⏳️️️️️️️ Создание ссылки для оплаты...`, {
        reply_markup: {
            inline_keyboard: []
        }
    })

    const operationId = uuidv4()
    let createInvoice = undefined
    try {
        createInvoice = await arMoney.createInvoice({
            amount: amount,
            operation_id: operationId,
            pair: "USDT-RUB",
            redirect_url: `https://t.me/${ctx.me.username}`,
        })
    } catch (e) {
        try {
            await alertBot.api.sendMessage(configDb.channelInvoiceId, `
#ERROR_CREATE_PAYMENT

<b>${configDb.paymentRubProvider.name.toUpperCase()}</b>
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



    const newTx = new Armoney()
    newTx.externalId = createInvoice["id"]
    newTx.user = ctx.user
    newTx.userId = ctx.user.id
    newTx.amount = Number(createInvoice["amount"])
    newTx.percentProvider = tier.percent
    newTx.extraFeePercent = tier.extraPercent
    newTx.type = TransactionType.TOP_UP
    newTx.status = ARMoneyTransactionStatus.CREATE
    newTx.currency = ARMoneyTransactionCurrency.RUB
    newTx.operationId = operationId

    await armoneyRepository.save(newTx)
    return ctx.editMessageText(`
🏷 ID: ${newTx.externalId}

<b>Перейдите на страницу оплаты</b>`,{
        reply_markup: {
            inline_keyboard: [
                [{text: "💳 Перейти на страницу оплаты", url: `${config.armoney.payUrl}/${createInvoice["id"]}`}],
                [{text: "🚫 Отменить", callback_data: `wallet cancel invoice ${createInvoice["id"]}`}],
            ]
        }
    })
}
