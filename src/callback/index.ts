import bodyParser from "body-parser";
// 👇 Ключевая строка
import express = require('express');

import { Request, Response } from 'express';
import { callbackInvoiceARMoney } from "@/services/payments/ARMoney/callbackInvoice";
import { ARMoneyCallbackInvoice } from "@/services/payments/ARMoney/interfaces";
import {CryptomusCallbackPayload} from "@/services/payments/cryptomus/interfaces";
import {cryptomusCallbackInvoice} from "@/services/payments/cryptomus/callbackInvoice";

export const startCallbackChecker = () => {
    const app = express();
    const PORT = 8888;

    app.use(bodyParser.json());

    app.post('/callback/armoney/invoice', async (req: Request<any, any, ARMoneyCallbackInvoice>, res: Response) => {
        const body = req.body;
        try {
            await callbackInvoiceARMoney(body);
        } catch (e) {
            console.error('Ошибка в обработке armoney invoice:', e);
        }
        res.status(200).send("OK");
    });

    app.post('/callback/cryptomus/invoice', async (req: Request<any, any, CryptomusCallbackPayload>, res: Response) => {
        const body = req.body;
        try {
            await cryptomusCallbackInvoice(body);
        } catch (e) {
            console.error('Ошибка в обработке armoney invoice:', e);
        }
        res.status(200).send("OK");
    });

    app.listen(PORT, () => {
        console.log(`🚀 Express running on http://localhost:${PORT}`);
    });
}