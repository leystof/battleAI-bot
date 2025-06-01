import {parseMode} from '@grammyjs/parse-mode'

import {PoolMiddleware, StopMiddleware, UserMiddleware} from '@/middlewares'

import {bot} from './bot'
import { setupSession } from './setupSession'
import {setupHandlers} from "@/handlers";
import {log} from "@/utils/logger";
import {dataSourceDatabase} from "@/database";
import {apiThrottler} from "@grammyjs/transformer-throttler";


export function beforeStart() {
    bot.api.config.use(parseMode('HTML'))
    bot.api.config.use(apiThrottler({
        global: {
            reservoir: 28,
            reservoirRefreshAmount: 28,
            reservoirRefreshInterval: 1000,
        },
        group: {
            reservoir: 5,
            reservoirRefreshAmount: 5,
            reservoirRefreshInterval: 1000,
        },
        out: {
            reservoir: 1,
            reservoirRefreshAmount: 1,
            reservoirRefreshInterval: 1000,
        }
    }))
    setupSession(bot)
    StopMiddleware(bot)
    UserMiddleware(bot)
    PoolMiddleware(bot)
    setupHandlers(bot)
    dataSourceDatabase
        .initialize()
        .then(() => {
            log.debug('Successfully connected to database')
            try {

            } catch (e){}
        })
        .catch((e) => log.fatal('Error while connect to database ', e))
}
