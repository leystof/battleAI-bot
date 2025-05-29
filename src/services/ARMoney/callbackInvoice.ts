import {configRepository, transactionRepository, userRepository} from "@/database";
import {
    ARMoneyAppealState,
    ARMoneyCallbackInvoice,
    ARMoneyToTransactionAppealReason,
    ARMoneyToTransactionStatus,
    ARMoneyInvoiceStatus, ARMoneyToTransactionAppealState
} from "@/services/ARMoney/interfaces";
import {
    TransactionAppealState,
    TransactionStatus
} from "@/database/models/interfaces/transaction";
import {alertBot, bot} from "@/utils/bot";
import {config} from "dotenv";
import {getPercent} from "@/helpers/getPercent";

export async function callbackInvoice(data: ARMoneyCallbackInvoice) {
    const config = await configRepository.findOne({
        where: { id: 1 },
    });

    const tx = await transactionRepository.findOne({
        where: { externalId: data.invoice_id },
        relations: ['user'],
    });


    try {
        if (!tx) {
            try {
                await alertBot.api.sendMessage(config.channelCallbackId, `
#ERROR
#ID_${data?.invoice_id}

Транзакция с invoice_id не найдена`, {

                })
            } catch (e){
            }

            return;
        }

        const amount = (data.new_amount) ? data.new_amount : data.amount
        const newAmount = Number(amount) - getPercent(Number(amount), tx.percentProvider)

        const newStatus = ARMoneyToTransactionStatus[data.state];

        if (String(data.appeal_state)) {
            tx.appealState = ARMoneyToTransactionAppealState[data.appeal_state]
            if (String(data.appeal_reason)) {
                tx.appealReason = ARMoneyToTransactionAppealReason[data.appeal_reason];
            }
        }

        const isSuccess =
            data.state === ARMoneyInvoiceStatus.PAID ||
            data.appeal_state === ARMoneyAppealState.USER_SUCCESS;

        console.log(isSuccess,tx.status, tx.status !== TransactionStatus.PAID)
        if (isSuccess && tx.status !== TransactionStatus.PAID) {
            tx.status = newStatus;

            tx.user.balance = Number(tx.user.balance) + newAmount;
            tx.status = TransactionStatus.PAID;
            console.log("update balance")

            await userRepository.save(tx.user);
            try {
                await bot.api.sendMessage(tx.user.tgId, `
#ID_${tx.externalId}

<b>💸 Баланс успешно пополнен: ${newAmount} ₽ </b>
             `)
            } catch (e) {}

        }

        await transactionRepository.save(tx);
    } catch (e) {
        try {
             await alertBot.api.sendMessage(config.channelCallbackId, `
#ERROR
#ID_${tx.externalId}

<b>👾 TYPE: ${tx.type}</b>
<b>🦴 ERROR:</b> ${e.toString()}
<b>🦻 CALLBACK:</b> <pre>${JSON.stringify(data)}</pre>
             `, {
                 parse_mode: "HTML"
             })
        } catch (e){
            console.log(e)
        }
    }
}
