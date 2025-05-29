import {beforeStart} from './utils/beforeStart'
import {bot} from "@/utils/bot";
import {run} from "@grammyjs/runner";
import bodyParser from "body-parser";
import express, { Request, Response } from 'express';
import {callbackInvoice} from "@/services/ARMoney/callbackInvoice";
import {ARMoneyCallbackInvoice} from "@/services/ARMoney/interfaces";

// Это mvp версия бота, которая легко масшабируется, сейчас я немного написал шит код
// который надо будет переписать

const app = express();
const PORT = 8888;

app.use(bodyParser.json());

app.post('/callback', async (req: Request<any,any, ARMoneyCallbackInvoice>, res: Response) => {
    console.log('📬 Получен callback:', req.body);
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