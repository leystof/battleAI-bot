import {Composer, InlineKeyboard} from "grammy";
import {Context} from "@/database/models/context";
import {arMoney} from "@/services/ARMoney";
import {ARMoneyInvoiceResponse} from "@/services/ARMoney/interfaces";
import {config} from "@/utils/config";
import { v4 as uuidv4 } from 'uuid';

import {
    TransactionCurrency,
    TransactionSource,
    TransactionStatus,
    TransactionType
} from "@/database/models/interfaces/transaction";
import {configRepository, tierProviderRepository, transactionRepository} from "@/database";
import {Transaction} from "@/database/models/transaction";
import {getPercent} from "@/helpers/getPercent";
import {MoreThan} from "typeorm";
import {alertBot} from "@/utils/bot";
import {getCachedConfig} from "@/modules/cache/config";
import {getUsername} from "@/helpers/getUsername";

export const composer = new Composer<Context>()
composer.callbackQuery('wallet topup', chooseAmount)
composer.hears('💰 Пополнить', chooseAmountCallback)
composer.callbackQuery(/^wallet topup (\d+)$/, preCreateOrder)
composer.callbackQuery(/^wallet topup (\d+) create$/, createOrder)

const text = (ctx: Context) => {
    return `<b>Выберите сумму:</b>`
}

const keyb = (ctx: Context) => {
    return new InlineKeyboard()
        .text("500 ₽", "wallet topup 500").row()
        .text("1000 ₽", "wallet topup 1000").row()
        .text("2000 ₽", "wallet topup 2000").row()
        .text("5000 ₽", "wallet topup 5000").row()
        .text("Своя сумма", "wallet topup another").row()
        .text("🔙 Назад к кошельку", "wallet menu")
}
async function chooseAmount(ctx) {
    return ctx.editMessageText(text(ctx),{
        reply_markup: keyb(ctx)
    })
}

async function chooseAmountCallback(ctx) {
    return ctx.reply(text(ctx),{
        reply_markup: keyb(ctx)
    })
}

async function createOrder(ctx: Context) {
    const tx = await transactionRepository.findOne({
        where: {
            user: {
                id: ctx.user.id
            },
            type: TransactionType.TOP_UP,
            status: TransactionStatus.CREATE,
            created_at: MoreThan(new Date(Date.now() - 60 * 60 * 1000)) // 1 hour
        }, relations: ["user"]
    })

    const configDb = await getCachedConfig()
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
    const amount = Number(ctx.match[1])
    await ctx.editMessageText(`⏳️️️️️️️ Создание ссылки для оплаты...`, {
        reply_markup: {
            inline_keyboard: []
        }
    })

    const operationId = uuidv4()
    const createInvoice: ARMoneyInvoiceResponse | {error: string} = await arMoney.createInvoice({
        amount: amount,
        operation_id: operationId,
        pair: "USDT-RUB",
        redirect_url: `https://t.me/${ctx.me.username}`,
    })

    if (createInvoice["error"]) {
        try {
            await alertBot.api.sendMessage(configDb.channelInvoiceId, `
#ERROR_CREATE_PAYMENT

<b>ARMONEY</b>
<b>Operation ID:</b> ${operationId}
<b>Пользователь:</b> ${await getUsername(ctx.user)}
<b>ID:</b> ${ctx.user.id}
<pre>${createInvoice["error"]}</pre>
            `, {
                parse_mode: "HTML"
            })
        } catch (e) {console.log(e)}
        return ctx.editMessageText("Ошибка при создании платежа.")
    }

    const newTx = new Transaction()
    newTx.externalId = createInvoice["id"]
    newTx.user = ctx.user
    newTx.userId = ctx.user.id
    newTx.amount = Number(createInvoice["amount"])
    newTx.percentProvider = 11.5
    newTx.type = TransactionType.TOP_UP
    newTx.status = TransactionStatus.CREATE
    newTx.source = configDb.paymentRubProvider
    newTx.currency = TransactionCurrency.RUB
    newTx.operationId = operationId

    await transactionRepository.save(newTx)
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
async function preCreateOrder(ctx: Context) {
    const amount = Number(ctx.match[1])
    const config = await configRepository.findOne({where: {id: 1},
        relations: ['paymentRubProvider']
    })
    const tier = await tierProviderRepository.findOne({where: {provider: config.paymentRubProvider},})

    if (amount < config.paymentRubProvider.minTopUp) {
        return ctx.reply(`<b>Минимальная сумма пополнения:</b> ${config.paymentRubProvider.minTopUp} ₽`)
    }

    return ctx.editMessageText(`
💰 <b>Подтверждение пополнения</b>

💳 <b>К оплате:</b> ${amount} ₽
💵 <b>Поступит на баланс:</b> ${amount - getPercent(amount,tier.percent)} ₽
📊 <b>Комиссия провайдера:</b> ${getPercent(amount,tier.percent)} ₽ (${tier.percent}%)

После успешной оплаты средства автоматически поступят на ваш игровой баланс.

Продолжить пополнение?`, {
        reply_markup: {
            inline_keyboard: [
                [{text: "💳 Оплатить", callback_data: `wallet topup ${amount} create`}],
            ]
        }
    })
}