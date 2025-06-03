import axios, { AxiosInstance } from "axios";
import crypto from "crypto";
import { config } from "@/utils/config";
import {ARMoneyInvoicePayload, ARMoneyInvoiceResponse} from "@/services/payments/ARMoney/interfaces";

export class ARMoney {
    private client: AxiosInstance;
    private apiKey: string;
    private secretKey: string;
    private shopId: string;

    constructor(apiKey: string, secretKey: string, shopId: string) {
        this.apiKey = apiKey;
        this.secretKey = secretKey;
        this.shopId = shopId;

        this.client = axios.create({
            baseURL: "https://endpoint.avr.money",
            headers: {
                "Content-Type": "application/json",
            },
        });

        this.client.interceptors.request.use((config) => {
            const nonce = Date.now();
            const message = this.apiKey + nonce;

            const signature = crypto
                .createHmac("sha256", this.secretKey)
                .update(message)
                .digest("hex");

            config.headers["APIKEY"] = this.apiKey;
            config.headers["NONCE"] = nonce;
            config.headers["SIGNATURE"] = signature;

            return config;
        });
    }

    async getInvoiceStatus(id: string) {
        try {
            const res = await this.client.get(`/api/v1/s2s/invoice/${id}`);
            return res.data;
        } catch (e) {
            return {
                error: e.toString()
            }
        }
    }

    async createInvoice(invoicePayload: ARMoneyInvoicePayload): Promise<ARMoneyInvoiceResponse> {
        try {
            const res = await this.client.post(`/api/v1/s2s/invoices/create/`, {
                ...invoicePayload,
                shop: this.shopId
            });

            return res.data as ARMoneyInvoiceResponse;
        } catch (e) {
            const msg = e?.response?.data?.message || e.message || "Unknown error";
            console.error("[ARMoney] create invoice error:", msg);
            throw new Error(msg);
        }
    }
    async cancelInvoice(externalId: string) {
        try {
            const res = await this.client.post(`/api/v1/s2s/invoice/${externalId}/cancel/`);
            return res.data;
        } catch (e) {
            return {
                error: e.toString()
            }
        }
    }

    async getState(externalId: string) {
        try {
            const res = await this.client.get(`/api/v1/s2s/invoice/${externalId}/state/`);
            return res.data;
        } catch (e) {
            return {
                error: e.toString()
            }
        }
    }

    async testPaid(externalId: string) {
        try {
            await fetch("http://localhost:8888/callback/armoney/invoice", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    'invoice_id': externalId,
                    'state': 4,
                    'new_amount': null,
                    'amount': "1000",
                    'appeal_state': 1,
                    'appeal_reason': ""
                })
            })
        } catch (e) {
            return {
                error: e.toString()
            }
        }
    }

    async getRubRate() {
        return 80.2
    }
}


export const arMoney = new ARMoney(
    config.armoney.apiKey,
    config.armoney.secretKey,
    config.armoney.shopId
)