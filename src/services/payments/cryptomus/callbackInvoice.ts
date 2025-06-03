import {configRepository, dataSourceDatabase, transactionRepository, userRepository} from "@/database";
import {
    ARMoneyAppealState,
    ARMoneyCallbackInvoice,
    ARMoneyToTransactionAppealReason,
    ARMoneyToTransactionStatus,
    ARMoneyInvoiceStatus,
    ARMoneyToTransactionAppealState
} from "@/services/payments/ARMoney/interfaces";
import { alertBot, bot } from "@/utils/bot";
import { getPercent } from "@/helpers/getPercent";
import { getUsername } from "@/helpers/getUsername";
import {User} from "@/database/models/user/user";
import {Armoney} from "@/database/models/payments/armoney";
import {TransactionStatus} from "@/database/models/payments/interfaces/transaction";

export async function cryptomusCallbackInvoice(data: ARMoneyCallbackInvoice) {
    const config = await configRepository.findOne({ where: { id: 1 } });

    await dataSourceDatabase.transaction("SERIALIZABLE", async (manager) => {
        const tx = await manager.findOne(Armoney, {
            where: { externalId: data.invoice_id },
            lock: { mode: "pessimistic_write" },
        });

        try {
            await alertBot.api.sendMessage(config.channelCallbackId, `
#ALERT
#ID_${data.invoice_id}

<b>🦻 CALLBACK:</b> <pre>${JSON.stringify(data)}</pre>

<b>📑 TX:</b> <pre>${JSON.stringify(tx)}</pre>
        `, { parse_mode: "HTML" });
        } catch (e) {}

        if (!tx) {
            await alertBot.api.sendMessage(config.channelCallbackId, `
#ERROR
#ID_${data.invoice_id}

Транзакция с invoice_id не найдена | Cryptomus
            `);
            return;
        }

        tx.user = await manager.findOneOrFail(User, { where: { id: tx.userId }, lock: { mode: "pessimistic_write" } });
        const amount = data.new_amount ?? data.amount;
        const newAmount = Number(amount) - getPercent(Number(amount), tx.percentProvider);
        const newStatus = ARMoneyToTransactionStatus[data.state];

        if (String(data.appeal_state)) {
            tx.appealState = ARMoneyToTransactionAppealState[data.appeal_state];
            if (String(data.appeal_reason)) {
                tx.appealReason = ARMoneyToTransactionAppealReason[data.appeal_reason];
            }
        }

        const isSuccess =
            data.state === ARMoneyInvoiceStatus.PAID ||
            data.appeal_state === ARMoneyAppealState.USER_SUCCESS;

        if (isSuccess && !tx.processed) {
            tx.status = ARMoneyToTransactionStatus[TransactionStatus.PAID];
            tx.user.balance = Number(tx.user.balance) + newAmount;
            tx.user.wager = Number(tx.user.wager) + newAmount;
            tx.user.totalDeposit = Number(tx.user.totalDeposit) + newAmount;
            tx.processed = true;

            await manager.save(tx.user);

            try {
                await bot.api.sendMessage(tx.user.tgId, `
#ID_${tx.externalId}

<b>💸 Баланс успешно пополнен: ${newAmount} ₽ </b>
                `, { parse_mode: "HTML" });

                await alertBot.api.sendMessage(config.channelInvoiceId, `
<code>#ID_${tx.externalId}</code>

<b>🏷 User ID:</b> <code>${tx.user.id}</code>
<b>💸 Пополнение баланса: ${amount} ₽ | ${newAmount} ₽ | ${tx.percentProvider}%</b>
<b>🙍‍♂️ Пользователь: ${await getUsername(tx.user)}</b>
                `, { parse_mode: "HTML" });
            } catch (e) {
                console.log("Ошибка отправки уведомления:", e);
            }
        }

        tx.status = newStatus;
        await manager.save(tx);
    }).catch(async (e) => {
        await alertBot.api.sendMessage(config.channelCallbackId, `
#ERROR
#ID_${data.invoice_id}

<b>🦴 ERROR:</b> ${e.toString()}
<b>🦻 CALLBACK:</b> <pre>${JSON.stringify(data)}</pre>
        `, { parse_mode: "HTML" });
    });
}