import axios, { AxiosInstance } from "axios";
import crypto from "crypto";
import { config } from "@/utils/config";
import {
    CryptomusInvoicePayload,
    CryptomusInvoiceResponse,
    CryptomusTestWebhookPayload
} from "@/services/payments/cryptomus/interfaces";
import {SequoiaInvoicePayload} from "@/services/payments/sequoia/interfaces";

export class SequoiaApi {
    private client: AxiosInstance;
    private apiKey: string;
    private shopId: string;
    private callbackInvoiceUrl: string;

    constructor(apiKey: string, callbackInvoiceUrl: string) {
        this.apiKey = "14XDijqQmluAnPEukGeHahd7";
        this.callbackInvoiceUrl = callbackInvoiceUrl;

        this.client = axios.create({
            baseURL: "https://sandbox.sequoia-pay.com",
            headers: {
                "Content-Type": "application/json",
            },
        });

        // this.client.interceptors.request.use((config) => {
        //     let body = config.data ?? {};
        //     if (typeof body !== "string") {
        //         body = JSON.stringify(body);
        //     }
        //
        //     const base64 = Buffer.from(body).toString("base64");
        //     const sign = crypto.createHash("md5").update(base64 + this.apiKey).digest("hex");
        //
        //     config.headers["merchant"] = this.shopId;
        //     config.headers["sign"] = sign;
        //
        //     return config;
        // });
    }

    async createInvoice(data: SequoiaInvoicePayload): Promise<any> {
        try {
            const orderId = data.order_id.toString();
            const secretKey = "14XDijqQmluAnPEukGeHahd7";

            const token = crypto.createHash("md5").update(`${orderId}${secretKey}`).digest("hex");
            console.log({
                ...data,
                callback_url: this.callbackInvoiceUrl,
                token: token
            })

            const res = await this.client.post("/api/pay", {
                ...data,
                callback_url: this.callbackInvoiceUrl,
                token: token
            }, {
                headers: {
                    "Content-Type": "application/json",
                }
            });

            return res.data
        } catch (e: any) {
            const msg = JSON.stringify(e?.response?.data) || e.message || "Unknown error";
            console.error("[Sequoia] createInvoice error:", msg);
            throw new Error(msg);
        }
    }

}


export const sequoia = new SequoiaApi(
    config.cryptomus.apiKey,
    config.domain.url + "/callback/sequoia/invoice",
)