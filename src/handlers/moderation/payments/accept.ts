import {Composer} from "grammy";
import {Context} from "@/database/models/context";
import {dataSourceDatabase} from "@/database";
import {ARMoneyTransactionStatus} from "@/database/models/payments/interfaces/armoney";
import {Transaction} from "@/database/models/payments/transaction";
import {getCachedConfig} from "@/modules/cache/config";
import {User} from "@/database/models/user/user";
import {Armoney} from "@/database/models/payments/armoney";


export const composer = new Composer<Context>()
composer.callbackQuery(/^payout accept (.+)$/, start)

async function start(ctx: Context) {
    let errorMessage: string | undefined = undefined;
    let transaction: Armoney = undefined

    await dataSourceDatabase.transaction("SERIALIZABLE", async (manager) => {
        const tx = await manager.findOne(Armoney, {
            where: {externalId: ctx.match[1]},
            lock: {mode: "pessimistic_write"},
        });

        if (!tx) {
            errorMessage = "undefinedTx"
            return ctx.answerCallbackQuery({
                show_alert: true,
                text: "Платеж не найден"
            })
        }
        tx.user = await manager.findOneOrFail(User, { where: { id: tx.userId }, lock: { mode: "pessimistic_write" } });
        transaction = tx

        if (tx.status === ARMoneyTransactionStatus.PAID) {
            errorMessage = "paid"
            return ctx.answerCallbackQuery({
                show_alert: true,
                text: "Платеж уже оплачен"
            })
        }

        if (tx.status === ARMoneyTransactionStatus.USER_CANCELLED) {
            errorMessage = "cancelUser"
            return ctx.answerCallbackQuery({
                show_alert: true,
                text: "Платеж отменен пользователем"
            })
        }

        tx.user.reservedBalance = Number(tx.user.reservedBalance) - Number(tx.amount)
        tx.status = ARMoneyTransactionStatus.PAID
        await manager.save(tx)
        await manager.save(tx.user)
    })

    try {
        let btnText = "❇️ Оплачено"

        if (errorMessage === "undefinedTx") {
            btnText = "Платеж не найден"
        }

        if (errorMessage === "cancelUser") {
            btnText = "🚫 Отменено пользователем"
        }

        await ctx.editMessageReplyMarkup({
            reply_markup: {
                inline_keyboard: [
                    [{text: btnText, callback_data: "qwerty"}]
                ]
            }
        })

        if (transaction && !errorMessage) {
            const config = await getCachedConfig()
            await ctx.api.sendMessage(transaction.user.tgId,`
✅ Ваш запрос на вывод 5000 ₽ одобрен и выполнен.

Деньги поступят на ваши реквизиты в течении 15 минут.

<a href="${config.supportUrl}">Онлайн поддержка</a>
            `)
        }
    } catch (e) {}
}
