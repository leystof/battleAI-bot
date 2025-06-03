import axios, { AxiosInstance } from "axios";
import crypto from "crypto";
import { config } from "@/utils/config";
import {
    CryptomusInvoicePayload,
    CryptomusInvoiceResponse,
    CryptomusTestWebhookPayload
} from "@/services/payments/cryptomus/interfaces";

export class CryptomusApi {
    private client: AxiosInstance;
    private apiKey: string;
    private shopId: string;
    private callbackInvoiceUrl: string;

    constructor(apiKey: string, shopId: string, domain: string) {
        this.apiKey = apiKey;
        this.shopId = shopId;
        this.callbackInvoiceUrl = domain;

        this.client = axios.create({
            baseURL: "https://api.cryptomus.com",
            headers: {
                "Content-Type": "application/json",
            },
        });

        this.client.interceptors.request.use((config) => {
            let body = config.data ?? {};
            if (typeof body !== "string") {
                body = JSON.stringify(body);
            }

            const base64 = Buffer.from(body).toString("base64");
            const sign = crypto.createHash("md5").update(base64 + this.apiKey).digest("hex");

            config.headers["merchant"] = this.shopId;
            config.headers["sign"] = sign;

            return config;
        });
    }

    async createInvoice(data: CryptomusInvoicePayload): Promise<CryptomusInvoiceResponse> {
        try {
            const res = await this.client.post("/v1/payment", {
                ...data,
                url_callback: this.callbackInvoiceUrl
            });
            return res.data?.["result"];
        } catch (e: any) {
            const msg = JSON.stringify(e?.response?.data) || e.message || "Unknown error";
            console.error("[Cryptomus] createInvoice error:", msg);
            throw new Error(msg);
        }
    }

    async getPayment(data: {uuid?: string, order_id?: string}): Promise<CryptomusInvoiceResponse> {
        try {
            const res = await this.client.post("/v1/payment/info", data);
            return res.data?.["result"];
        } catch (e: any) {
            const msg = JSON.stringify(e?.response?.data) || e.message || "Unknown error";
            console.error("[Cryptomus] createInvoice error:", msg);
            throw new Error(msg);
        }
    }

    async testCallback(data: CryptomusTestWebhookPayload): Promise<any> {
        try {
            const res = await this.client.post("/v1/test-webhook/payment", {
                ...data,
                url_callback: this.callbackInvoiceUrl
            });

            return res.data;
        } catch (e: any) {
            const msg = JSON.stringify(e?.response?.data) || e.message || "Unknown error";
            console.error("[Cryptomus] testCallback error:", msg);
            throw new Error(msg);
        }
    }

}


export const cryptomus = new CryptomusApi(
    config.cryptomus.apiKey,
    config.cryptomus.shopId,
    config.domain.url + "/callback/cryptomus/invoice",
)