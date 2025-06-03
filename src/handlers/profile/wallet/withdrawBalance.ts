import {Composer, InlineKeyboard} from "grammy";
import {Context} from "@/database/models/context";
import {Scene} from "grammy-scenes";
import {
    armoneyRepository,
    configRepository,
    transactionRepository,
    userRepository
} from "@/database";
import {Transaction} from "@/database/models/payments/transaction";
import {
    ARMoneyTransactionCurrency,
    ARMoneyTransactionStatus,
} from "@/database/models/payments/interfaces/armoney";
import { v4 as uuidv4 } from 'uuid';
import {getUsername} from "@/helpers/getUsername";
import {Armoney} from "@/database/models/payments/armoney";
import {TransactionStatus, TransactionType} from "@/database/models/payments/interfaces/transaction";
export const composer = new Composer<Context>()
composer.callbackQuery('wallet withdraw', withdraw)


async function withdraw(ctx: Context) {
    try {
        await ctx.answerCallbackQuery()
    } catch (e) {}

    return ctx.scenes.enter('wallet topup withdraw value')
}

export const scene = new Scene<Context>('wallet topup withdraw value')

async function cancel (ctx) {
    try {
        await ctx.deleteMessage()
        ctx.scene.exit()
    } catch (e) {}
}

scene.always().callbackQuery('wallet topup withdraw value', cancel)

scene.do(async (ctx: Context) => {
    console.log(1)
    const response = await ctx.reply("<b>Введите сумму для вывода:</b>", {
        reply_markup: {
            inline_keyboard: [
                [{text: "Отмена", callback_data: "wallet topup withdraw value"}]
            ]
        }
    })
    // @ts-ignore
    ctx.scene.resume()
//
})

scene.wait().hears(/\d+/, async (ctx: Context) => {
    const amount = Number(ctx.message.text)
    ctx.session.amount = amount

    const config = await configRepository.findOne({where: {id: 1},
        relations: ['withdrawRubProvider']
    })

    if (amount < config.withdrawRubProvider.minPayOut) {
        // @ts-ignore
        try {ctx.scene.exit()} catch (e) {}
        return ctx.reply(`<b>Минимальная сумма для вывода:</b> ${config.withdrawRubProvider.minPayOut} ₽`, {
            reply_markup: {
                inline_keyboard: [
                    [{text: "Назад", callback_data: "wallet menu"}]
                ]
            }
        })
    }

    if (amount > Number(ctx.user.balance)) {
        // @ts-ignore
        try {ctx.scene.exit()} catch (e) {}
        return ctx.reply(`
❌ <b>Недостаточно средств для вывода</b>

💸 <b>Запрошенная сумма:</b> ${amount} ₽
💰 <b>Ваш доступный баланс:</b> ${ctx.user.balance} ₽
📊 <b>Недостает:</b> ${amount - Number(ctx.user.balance)} ₽

Вы можете вывести максимум ${Number(ctx.user.balance)} ₽. Это ваш текущий доступный баланс за вычетом зарезервированных средств.
        `, {
            reply_markup: {
                inline_keyboard: [
                    [{text: "Закрыть", callback_data: "deleteMessage"}]
                ]
            }
        })
    }

    if (amount > Number(ctx.user.balance) - Number(ctx.user.wager)) {
        // @ts-ignore
        try {ctx.scene.exit()} catch (e) {}
        return ctx.reply(`
❌ <b>Вывод невозможен: не выполнены требования вейджера</b>

💰 <b>Вы пытаетесь вывести:</b> ${amount} ₽

⚠️ Перед выводом необходимо отыграть вейджер:
• <b>Осталось отыграть:</b> ${amount - Math.max(0,Number(ctx.user.balance) - Number(ctx.user.wager))} ₽
• <b>Доступно для вывода:</b> ${Math.max(0,Number(ctx.user.balance) - Number(ctx.user.wager))} ₽

ℹ️ Для выполнения требований вейджера продолжайте играть в игры. Каждая ваша ставка учитывается в счет отыгрыша вейджера.
        `, {
            reply_markup: {
                inline_keyboard: [
                    [{text: "🎮 Играть", callback_data: "game menu"}],
                    [{text: "◀️ Назад", callback_data: "wallet menu"}],
                    [{text: "❓ Что такое вейджер?", callback_data: "wager help"}],
                ]
            }
        })
    }



    await ctx.reply(`<b>Введите номер карты</b>`, {
        reply_markup: {
            inline_keyboard: [
                [{text: "Отмена", callback_data: "wallet topup withdraw value"}]
            ]
        }
    })

    // @ts-ignore
    ctx.scene.resume()
})

scene.wait().hears(/.+/, async (ctx: Context) => {
    if (ctx.message.text && ctx.message.text.length > 255) {
        return ctx.reply("<b>Номер карты не должен превышать 255 символов</b>",
            {
                reply_markup: {
                    inline_keyboard: [
                        [{text: "Отмена", callback_data: "wallet topup withdraw value"}]
                    ]
                }
            })
    }

    const config = await configRepository.findOne({where: {id: 1},relations: ["withdrawRubProvider"]})

    const newTx = new Armoney()
    newTx.externalId = uuidv4();
    newTx.user = ctx.user
    newTx.userId = ctx.user.id
    newTx.amount = ctx.session.amount
    newTx.percentProvider = 0
    newTx.type = TransactionType.WITHDRAW
    newTx.status = ARMoneyTransactionStatus.CREATE
    newTx.currency = ARMoneyTransactionCurrency.RUB

    await armoneyRepository.save(newTx)

    try {
        await ctx.api.sendMessage(config.channelPayOutId, `
#ID_${newTx.externalId}

<b>Сумма:</b> <code>${ctx.session.amount}</code> ₽
<b>Номер карты:</b> <code>${ctx.message.text}</code>
<b>Провайдер:</b> ARMoney

<b>Пользователь:</b> ${await getUsername(ctx.user)}
<b>ID:</b> ${ctx.user.id}
        `, {
            reply_markup: {
                inline_keyboard: [
                    [{text: "❇️ Оплатить", callback_data: `payout accept ${newTx.externalId}`}],
                    [{text: "🚫 Отменить", callback_data: `payout cancel ${newTx.externalId}`}],
                ]
            }
        })

        await ctx.reply(`
🏷 ID: ${newTx.externalId}

<b>Сумма:</b> ${ctx.session.amount} ₽
<b>Номер карты:</b> ${ctx.message.text}

<b>Заявка проверяется модерацией, баланс зарезервирован.</b>
        `)

        ctx.user.balance = Number(ctx.user.balance) - Number(ctx.session.amount)
        ctx.user.reservedBalance = Number(ctx.user.reservedBalance) + Number(ctx.session.amount)
        await userRepository.save(ctx.user)
    } catch (e) {
        await ctx.reply(`Неизвестная ошибка, повторите позже.`)
    }
    // @ts-ignore
    try {ctx.scene.exit()} catch (e) {}
})

