import {beforeStart} from './utils/beforeStart'
import {bot} from "@/utils/bot";
import {run} from "@grammyjs/runner";
import bodyParser from "body-parser";
import express, { Request, Response } from 'express';
import {callbackInvoice} from "@/services/payments/ARMoney/callbackInvoice";
import {ARMoneyCallbackInvoice} from "@/services/payments/ARMoney/interfaces";

// Это mvp версия бота, которая легко масшабируется, сейчас я немного написал шит код
// который надо будет переписать

const app = express();
const PORT = 8888;

app.use(bodyParser.json());

app.post('/callback/armoney/invoice', async (req: Request<any,any, ARMoneyCallbackInvoice>, res: Response) => {
    const body = req.body;
    try {await callbackInvoice(body)} catch (e) {}
    res.status(200).send("OK");
});

beforeStart()
bot.catch((e) => console.log(e))
run(bot).start()


app.listen(PORT, () => {
    console.log(`🚀 Express listen localhost:${PORT}`);
});