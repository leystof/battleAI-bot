import {
    TransactionAppealReason,
    TransactionAppealState,
    TransactionStatus
} from "@/database/models/interfaces/transaction";

export interface ARMoneyInvoicePayload {
    pair: "USDT-RUB";            // Валютная пара (фиксированная)
    amount: number;              // Сумма в RUB
    redirect_url: string;        // Куда перенаправить после оплаты
    operation_id?: string;        // Уникальный ID операции
    client_id?: string;           // ID клиента в твоей системе
    client_type?: number;         // Тип клиента (напр. 1 = физлицо, 2 = юрлицо и т.д.)
}

export interface ARMoneyInvoiceResponse {
    id: string,
    shop: string,
    pair: string,
    amount: number,
    url: string,
    redirect_url: string,
    chat: string,
    client_id: string
}

export interface ARMoneyCallbackInvoice {
    'invoice_id': string,
    'state': number,
    'new_amount': string,
    'amount': string,
    'appeal_state': number,
    'appeal_reason': string
    [key: string]: any;
}

export enum ARMoneyAppealReason {
    TRADER_NOT_CONFIRM_PAYMENT = 1,
    OVERPAYMENT = 2,
    INVOICE_EXPIRED_WITH_PAYMENT = 3,
    FRAUD = 4,
    PAYMENT_NOT_RECEIVED = 5,
    BUYER_PAID_LESS = 6,
    MALICIOUS_ORDER_CANCELLATION = 7,
    CONFIRMATION_DOCUMENTS = 8,
    BANK_ACCOUNT_FROZEN = 9,
    NEW_AMOUNT = 10,
    OTHER = 99,
}

export enum ARMoneyAppealState {
    NOT_SET = 1,
    APPEALED = 2,
    USER_SUCCESS = 3,
    TRADER_SUCCESS = 4,
}

export enum ARMoneyInvoiceStatus {
    CREATED = 1,
    WAITING_FOR_PAYMENT = 2,
    WAITING_FOR_PAYMENT_CONFIRMATION = 3,
    PAID = 4,
    TIMEOUT = 5,
    CANCELLED = 6,
    INCORRECT_AMOUNT = 7,
    RESTORED = 8,
}

export const ARMoneyToTransactionAppealReason: Record<ARMoneyAppealReason, TransactionAppealReason> = {
    [ARMoneyAppealReason.TRADER_NOT_CONFIRM_PAYMENT]: TransactionAppealReason.TRADER_NOT_CONFIRM_PAYMENT,
    [ARMoneyAppealReason.OVERPAYMENT]: TransactionAppealReason.OVERPAYMENT,
    [ARMoneyAppealReason.INVOICE_EXPIRED_WITH_PAYMENT]: TransactionAppealReason.INVOICE_EXPIRED_WITH_PAYMENT,
    [ARMoneyAppealReason.FRAUD]: TransactionAppealReason.FRAUD,
    [ARMoneyAppealReason.PAYMENT_NOT_RECEIVED]: TransactionAppealReason.PAYMENT_NOT_RECEIVED,
    [ARMoneyAppealReason.BUYER_PAID_LESS]: TransactionAppealReason.BUYER_PAID_LESS,
    [ARMoneyAppealReason.MALICIOUS_ORDER_CANCELLATION]: TransactionAppealReason.MALICIOUS_ORDER_CANCELLATION,
    [ARMoneyAppealReason.CONFIRMATION_DOCUMENTS]: TransactionAppealReason.CONFIRMATION_DOCUMENTS,
    [ARMoneyAppealReason.BANK_ACCOUNT_FROZEN]: TransactionAppealReason.BANK_ACCOUNT_FROZEN,
    [ARMoneyAppealReason.NEW_AMOUNT]: TransactionAppealReason.NEW_AMOUNT,
    [ARMoneyAppealReason.OTHER]: TransactionAppealReason.OTHER,
};

export const ARMoneyToTransactionStatus: Record<ARMoneyInvoiceStatus, TransactionStatus> = {
    [ARMoneyInvoiceStatus.CREATED]: TransactionStatus.CREATE,
    [ARMoneyInvoiceStatus.WAITING_FOR_PAYMENT]: TransactionStatus.WAITING_FOR_PAYMENT,
    [ARMoneyInvoiceStatus.WAITING_FOR_PAYMENT_CONFIRMATION]: TransactionStatus.WAITING_FOR_PAYMENT_CONFIRMATION,
    [ARMoneyInvoiceStatus.PAID]: TransactionStatus.PAID,
    [ARMoneyInvoiceStatus.TIMEOUT]: TransactionStatus.TIMEOUT,
    [ARMoneyInvoiceStatus.CANCELLED]: TransactionStatus.CANCELLED,
    [ARMoneyInvoiceStatus.INCORRECT_AMOUNT]: TransactionStatus.INCORRECT_AMOUNT,
    [ARMoneyInvoiceStatus.RESTORED]: TransactionStatus.RESTORED,
};

export const ARMoneyToTransactionAppealState: Record<ARMoneyAppealState, TransactionAppealState> = {
    [ARMoneyAppealState.NOT_SET]: TransactionAppealState.NOT_SET,
    [ARMoneyAppealState.APPEALED]: TransactionAppealState.APPEALED,
    [ARMoneyAppealState.USER_SUCCESS]: TransactionAppealState.USER_SUCCESS,
    [ARMoneyAppealState.TRADER_SUCCESS]: TransactionAppealState.TRADER_SUCCESS,
};