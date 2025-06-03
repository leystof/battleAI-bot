import {configRepository, dataSourceDatabase} from "@/database";
import {alertBot, bot} from "@/utils/bot";
import {User} from "@/database/models/user/user";
import {CryptomusCallbackPayload} from "@/services/payments/cryptomus/interfaces";
import {Cryptomus} from "@/database/models/payments/cryptomus";
import {CryptomusStatus} from "@/database/models/payments/interfaces/cryptomus";
import {getPercent} from "@/helpers/getPercent";
import {Transaction} from "@/database/models/payments/transaction";
import {TransactionStatus, TransactionType} from "@/database/models/payments/interfaces/transaction";
import {getUsername} from "@/helpers/getUsername";

export async function cryptomusCallbackInvoice(data: CryptomusCallbackPayload) {
    const config = await configRepository.findOne({ where: { id: 1 } });

    await dataSourceDatabase.transaction("SERIALIZABLE", async (manager) => {
        const txCryptomus = await manager.findOne(Cryptomus, {
            where: { externalId: data.order_id },
            lock: { mode: "pessimistic_write" },
        });

        try {
            await alertBot.api.sendMessage(config.channelCallbackId, `
#ALERT
#ID_${data?.order_id}

<b>🦻 CALLBACK:</b> <pre>${JSON.stringify(data)}</pre>

<b>📑 TX:</b> <pre>${JSON.stringify(txCryptomus)}</pre>
        `, { parse_mode: "HTML" });
        } catch (e) {}

        if (!txCryptomus) {
            await alertBot.api.sendMessage(config.channelCallbackId, `
#ERROR
#ID_${data?.order_id}

Транзакция с invoice_id не найдена | Cryptomus
            `);
            return;
        }

        txCryptomus.user = await manager.findOneOrFail(User, { where: { id: txCryptomus.userId }, lock: { mode: "pessimistic_write" } });

        txCryptomus.status = CryptomusStatus[data.status.toUpperCase()]

        if (
            (data.status === CryptomusStatus.PAID || data.status === CryptomusStatus.PAID_OVER)
            && !txCryptomus.processed) {
            const addBalance = Number(data.merchant_amount) - getPercent(Number(data.payment_amount), txCryptomus.extraFeePercent)
            txCryptomus.amount = Number(data.payment_amount)
            txCryptomus.processed = true
            txCryptomus.user.balance = Number(txCryptomus.user.balance) + addBalance

            const tx = new Transaction()
            tx.amount = addBalance
            tx.type = TransactionType.TOP_UP
            tx.user = txCryptomus.user
            tx.cryptomus = txCryptomus
            tx.status = TransactionStatus.PAID

            await manager.save(txCryptomus)
            await manager.save(tx)
            await manager.save(txCryptomus.user)

            try {
                await bot.api.sendMessage(txCryptomus.user.tgId, `
#ID_${txCryptomus.externalId}

<b>💸 Баланс успешно пополнен: ${addBalance} ${config.currencyName} </b>
                `, { parse_mode: "HTML" });

                await alertBot.api.sendMessage(config.channelInvoiceId, `
<code>#ID_${txCryptomus.externalId}</code>

<b>🏷 User ID:</b> <code>${txCryptomus.user.id}</code>
<b>💸 Пополнение баланса:\n ${data.payment_amount} USDT | ${data.merchant_amount} USDT | ${addBalance} ${config.currencyName} | ${txCryptomus.percentProvider}% | ${txCryptomus.extraFeePercent}%</b>
<b>🙍‍♂️ Пользователь: ${await getUsername(txCryptomus.user)}</b>
                `, { parse_mode: "HTML" });
            } catch (e) {
                console.log("Ошибка отправки уведомления:", e);
            }
        }


    }).catch(async (e) => {
        await alertBot.api.sendMessage(config.channelCallbackId, `
#ERROR Cryptomus
#ID_${data?.order_id}

<b>🦴 ERROR:</b> ${e.toString()}
<b>🦻 CALLBACK:</b> <pre>${JSON.stringify(data)}</pre>
        `, { parse_mode: "HTML" });
    });
}