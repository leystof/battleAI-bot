import {Bot} from 'grammy'
import { config } from './config'
import {Context} from "@/database/models/context";
import {apiThrottler} from "@grammyjs/transformer-throttler";


export const bot = new Bot<Context>(config.bot.mainApiKey)
export const alertBot = new Bot<Context>(config.bot.alertApiKey)

alertBot.api.config.use(apiThrottler({
    global: {
        reservoir: 28,
        reservoirRefreshAmount: 28,
        reservoirRefreshInterval: 1000,
    },
    group: {
        reservoir: 1,
        reservoirRefreshAmount: 1,
        reservoirRefreshInterval: 1000,
    },
    out: {
        reservoir: 1,
        reservoirRefreshAmount: 1,
        reservoirRefreshInterval: 1000,
    }
}))

bot.catch((e) => console.log(e))
alertBot.catch((e) => console.log(e))
