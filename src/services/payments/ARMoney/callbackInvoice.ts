import {configRepository, dataSourceDatabase} from "@/database";
import {
    ARMoneyAppealState,
    ARMoneyCallbackInvoice,
    ARMoneyInvoiceStatus,
    ARMoneyToTransactionAppealReason,
    ARMoneyToTransactionAppealState,
    ARMoneyToTransactionStatus
} from "@/services/payments/ARMoney/interfaces";
import {ARMoneyTransactionStatus} from "@/database/models/payments/interfaces/armoney";
import {alertBot, bot} from "@/utils/bot";
import {getPercent} from "@/helpers/getPercent";
import {getUsername} from "@/helpers/getUsername";
import {Transaction} from "@/database/models/payments/transaction";
import {User} from "@/database/models/user/user";
import {Armoney} from "@/database/models/payments/armoney";
import {rubToUsdt} from "@/helpers/payments/rubToUsdt";
import {TransactionStatus, TransactionType} from "@/database/models/payments/interfaces/transaction";
import {Decimal128} from "typeorm";

export async function callbackInvoiceARMoney(data: ARMoneyCallbackInvoice) {
    const config = await configRepository.findOne({ where: { id: 1 } });
    await dataSourceDatabase.transaction("SERIALIZABLE", async (manager) => {
        const armoneyTx = await manager.findOne(Armoney, {
            where: { externalId: data.invoice_id },
            lock: { mode: "pessimistic_write" },
        });

        try {
            await alertBot.api.sendMessage(config.channelCallbackId, `
#ALERT
#ID_${data?.invoice_id}

<b>🦻 CALLBACK:</b> <pre>${JSON.stringify(data)}</pre>

<b>📑 armoneyTx:</b> <pre>${JSON.stringify(armoneyTx)}</pre>
        `, { parse_mode: "HTML" });
        } catch (e) {}

        if (!armoneyTx) {
            await alertBot.api.sendMessage(config.channelCallbackId, `
#ERROR | ARMoney
#ID_${data?.invoice_id}

Транзакция с invoice_id не найдена | ARMoney
            `);
            return;
        }

        armoneyTx.user = await manager.findOneOrFail(User, { where: { id: armoneyTx.userId }, lock: { mode: "pessimistic_write" } });
        const amount = data.new_amount ?? data.amount;
        const preNewAmount = Number(amount) - getPercent(Number(amount), armoneyTx.percentProvider);
        const newAmount = await rubToUsdt(preNewAmount, {fee: 3,source: "armoney"})
        const newStatus = ARMoneyToTransactionStatus[data.state];

        if (String(data.appeal_state)) {
            armoneyTx.appealState = ARMoneyToTransactionAppealState[data.appeal_state];
            if (String(data.appeal_reason)) {
                armoneyTx.appealReason = ARMoneyToTransactionAppealReason[data.appeal_reason];
            }
        }

        const isSuccess =
            data.state === ARMoneyInvoiceStatus.PAID ||
            data.appeal_state === ARMoneyAppealState.USER_SUCCESS;

        if (isSuccess && !armoneyTx.processed) {
            armoneyTx.status = ARMoneyTransactionStatus.PAID;
            armoneyTx.user.balance = Number(armoneyTx.user.balance) + newAmount;
            armoneyTx.user.wager = Number(armoneyTx.user.wager) + newAmount;
            armoneyTx.user.totalDeposit = Number(armoneyTx.user.totalDeposit) + newAmount;
            armoneyTx.amount = Number(amount);
            armoneyTx.processed = true;
            
            const tx = new Transaction()
            tx.amount = newAmount
            tx.user = armoneyTx.user
            tx.status = TransactionStatus.PAID
            tx.type = TransactionType.TOP_UP
            tx.armoney = armoneyTx
            await manager.save(tx);
            await manager.save(armoneyTx.user);

            try {
                await bot.api.sendMessage(armoneyTx.user.tgId, `
#ID_${armoneyTx.externalId}

<b>💸 Баланс успешно пополнен: ${newAmount} ${config.currencyName} </b>
                `, { parse_mode: "HTML" });

                await alertBot.api.sendMessage(config.channelInvoiceId, `
<code>#ID_${armoneyTx.externalId}</code>

<b>🏷 User ID:</b> <code>${armoneyTx.user.id}</code>
<b>💸 Пополнение баланса:\n ${amount} ₽ | ${preNewAmount} ₽ | ${newAmount} ${config.currencyName} | ${armoneyTx.percentProvider}%</b>
<b>🙍‍♂️ Пользователь: ${await getUsername(armoneyTx.user)}</b>
                `, { parse_mode: "HTML" });
            } catch (e) {
                console.log("Ошибка отправки уведомления:", e);
            }
        }

        armoneyTx.status = newStatus;
        await manager.save(armoneyTx);
    }).catch(async (e) => {
        await alertBot.api.sendMessage(config.channelCallbackId, `
#ERROR | ARMoney
#ID_${data?.invoice_id}

<b>🦴 ERROR:</b> ${e.toString()}
<b>🦻 CALLBACK:</b> <pre>${JSON.stringify(data)}</pre>
        `, { parse_mode: "HTML" });
    });
}