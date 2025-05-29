import {transactionRepository} from "@/database";
import {
    ARMoneyAppealState,
    ARMoneyCallbackInvoice,
    ARMoneyInvoiceStatus, ARMoneyToTransactionAppealReason,
    ARMoneyToTransactionStatus
} from "@/services/ARMoney/interfaces";
import {TransactionAppealState, TransactionStatus} from "@/database/models/interfaces/transaction";

export async function callbackInvoice(data: ARMoneyCallbackInvoice) {
    try {
        const tx = await transactionRepository.findOne({
            where: {
                externalId: data.invoice_id
            },
            relations: ['user']
        })

        const addBalance = (data.new_amount) ? Number(data.new_amount) : Number(data.amount)

        if (data.appeal_state === ARMoneyAppealState.NOT_SET) {
            tx.appealState = TransactionAppealState.NOT_SET

            if (data.state === ARMoneyInvoiceStatus.PAID) {
                tx.user.balance = Number(tx.user.balance) + addBalance
                tx.status = ARMoneyToTransactionStatus[data.state]
            } else {
                tx.status = ARMoneyToTransactionStatus[data.state]
            }

        } else if (String(data.appeal_state)) {
            if (data.appeal_state === ARMoneyAppealState.USER_SUCCESS) {
                tx.status = ARMoneyToTransactionAppealReason[data.state]

                tx.appealState = TransactionAppealState.APPEALED
            }
        }


    } catch (e) {

    }
}