import axios, { AxiosInstance } from "axios";
import crypto from "crypto";
import { config } from "@/utils/config";
import {CryptomusInvoicePayload, CryptomusInvoiceResponse} from "@/services/payments/cryptomus/interfaces";

type Result<T> = { data: T } | { error: string };
export class Cryptomus {
    private client: AxiosInstance;
    private apiKey: string;
    private shopId: string;

    constructor(apiKey: string, shopId: string) {
        this.apiKey = apiKey;
        this.shopId = shopId;

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
            const res = await this.client.post("/v1/payment", data);
            return res.data;
        } catch (e: any) {
            const msg = JSON.stringify(e?.response?.data) || e.message || "Unknown error";
            console.error("[Cryptomus] createInvoice error:", msg);
            throw new Error(msg);
        }
    }
}


export const cryptomus = new Cryptomus(
    config.cryptomus.apiKey,
    config.cryptomus.shopId,
)