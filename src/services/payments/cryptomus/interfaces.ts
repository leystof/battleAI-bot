export interface CryptomusInvoicePayload {
    amount: string;                      // Сумма, например: "10.50"
    currency: string;                    // Валюта, например: "USD"
    order_id: string;                    // Уникальный ID заказа

    url_return?: string;                 // URL для возврата до оплаты
    url_success?: string;                // URL после успешной оплаты
    url_callback?: string;               // Webhook для получения уведомлений

    to_currency?: string;                // В какую криптовалюту конвертировать
    lifetime?: number;                   // Срок действия счета в секундах (по умолчанию 3600)
    is_payment_multiple?: boolean;      // Разрешить частичную оплату (true/false)
    subtract?: number;                  // Процент комиссии, оплачиваемой клиентом (0–100)
    accuracy_payment_percent?: number;  // Допустимая погрешность в оплате (0–5)
    additional_data?: string;           // Любая строка — не отображается клиенту
    currencies?: string[];              // Разрешённые криптовалюты
    except_currencies?: string[];       // Запрещённые криптовалюты
    course_source?: string;             // Источник курса, например: "Binance"
    from_referral_code?: string;        // Реферальный код
    discount_percent?: number;          // Скидка или наценка в процентах (-99 до 100)
    is_refresh?: boolean;               // Обновить адрес оплаты при повторе
}

export interface CryptomusInvoiceResponse {
    uuid: string; // Уникальный идентификатор платежа (внутренний ID Cryptomus)
    address: string; // Крипто-адрес для перевода
    amount: string; // Сумма к оплате (в криптовалюте)
    invoice_amount: string; // Сумма счета (в указанной валюте, напр. USD)
    currency: string; // Валюта оплаты, напр. BTC, USDT
    network: string; // Сеть блокчейна (если указана)
    url: string; // Прямая ссылка на оплату
    expired_at: number; // Unix timestamp — когда истекает счет
    timeout_seconds: number; // Сколько секунд счет действителен
    order_id: string; // ID заказа, который ты передал
    status: "pending" | "paid" | "cancel" | "expired"; // Текущий статус

    additional_data?: string; // То, что ты передал в additional_data
    is_final?: boolean; // Финальное ли состояние

    to_currency?: string; // В какую валюту сконвертировано (если указана)
    course?: string; // Курс обмена, если была конвертация
}