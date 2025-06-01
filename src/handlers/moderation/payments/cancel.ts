import {Composer} from "grammy";
import {Context} from "@/database/models/context";
import {dataSourceDatabase} from "@/database";
import {TransactionStatus} from "@/database/models/interfaces/transaction";
import {Transaction} from "@/database/models/transaction";
import {User} from "@/database/models/user";
import {getCachedConfig} from "@/modules/cache/config";


export const composer = new Composer<Context>()
composer.callbackQuery(/^payout cancel (.+)$/, start)

async function start(ctx: Context) {
    let errorMessage: string | undefined = undefined;
    let transaction: Transaction = undefined
    await dataSourceDatabase.transaction("SERIALIZABLE", async (manager) => {
        const tx = await manager.findOne(Transaction, {
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
        if (tx.status === TransactionStatus.CANCELLED) {
            errorMessage = "cancel"
            return ctx.answerCallbackQuery({
                show_alert: true,
                text: "Платеж уже отменен"
            })
        }

        if (tx.status === TransactionStatus.USER_CANCELLED) {
            errorMessage = "cancelUser"
            return ctx.answerCallbackQuery({
                show_alert: true,
                text: "Платеж отменен пользователем"
            })
        }

        tx.user.reservedBalance = Number(tx.user.reservedBalance) - Number(tx.amount)
        tx.user.balance = Number(tx.user.balance) + Number(tx.amount)
        tx.status = TransactionStatus.CANCELLED
        await manager.save(tx)
        await manager.save(tx.user)
    })

    try {
        let btnText = "🚫 Отменено"

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
❌ Ваш запрос на вывод ${transaction.amount} ₽ отклонен. Средства возвращены на ваш баланс.

<a href="${config.supportUrl}">Онлайн поддержка</a>
            `)
        }
    } catch (e) {}
}
