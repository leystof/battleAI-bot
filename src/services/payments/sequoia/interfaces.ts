export interface SequoiaInvoicePayload {
  "order_id": string,
  "amount": number,
  "token"?: string,
  "payment_method": number,
  "currency": "RUB",
  "callback_url"?: string,
  "back_to_merchant_success_url"?: string,
  "back_to_merchant_url"?: string,
  "merchant_user_id"?: string,
  "merchant_user_ip"?: string,
  "date": string
}