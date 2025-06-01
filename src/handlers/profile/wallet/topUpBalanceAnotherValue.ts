import {Composer, InlineKeyboard} from "grammy";
import {Context} from "@/database/models/context";
import {Scene} from "grammy-scenes";
import {configRepository, tierProviderRepository} from "@/database";
import {getPercent} from "@/helpers/getPercent";

export const composer = new Composer<Context>()
composer.callbackQuery(/wallet topup (another)/, setAnotherValue)

async function setAnotherValue(ctx: Context) {
    try {
        await ctx.answerCallbackQuery()
    } catch (e) {}

    return ctx.scenes.enter('wallet topup another value')
}

export const scene = new Scene<Context>('wallet topup another value')

async function cancel (ctx) {
    try {
        await ctx.deleteMessage()
        ctx.scene.exit()
    } catch (e) {}
}

scene.always().callbackQuery('wallet topup another value', cancel)

scene.do(async (ctx) => {
    const response = await ctx.reply("<b>Введите сумму пополнения:</b>", {
        reply_markup: {
            inline_keyboard: [
                [{text: "Отмена", callback_data: "wallet topup another value"}]
            ]
        }
    })
    ctx.scene.resume()
})

scene.wait().hears(/\d+/, async (ctx: Context) => {
    const amount = Number(ctx.message.text)
    const config = await configRepository.findOne({where: {id: 1},
        relations: ['paymentRubProvider']
    })

    if (amount < config.paymentRubProvider.minTopUp) {
        // @ts-ignore
        try {ctx.scene.exit()} catch (e) {}
        return ctx.reply(`<b>Минимальная сумма пополнения:</b> ${config.paymentRubProvider.minTopUp} ₽`, {
            reply_markup: {
                inline_keyboard: [
                    [{text: "Назад", callback_data: "wallet menu"}]
                ]
            }
        })
    }
    const tier = await tierProviderRepository.findOne({where: {provider: config.paymentRubProvider},})

    try {
        // @ts-ignore
        ctx.scene.exit()
    } catch (e) {}
    return ctx.reply(`
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
})
