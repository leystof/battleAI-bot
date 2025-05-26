import {parseMode} from '@grammyjs/parse-mode'

import {PoolMiddleware, UserMiddleware} from '@/middlewares'

import {bot} from './bot'
import { setupSession } from './setupSession'
import {setupHandlers} from "@/handlers";
import {log} from "@/utils/logger";
import {dataSourceDatabase} from "@/database";


export function beforeStart() {
    bot.api.config.use(parseMode('HTML'))
    // bot.api.config.use(apiThrottler())
    setupSession(bot)
    UserMiddleware(bot)
    PoolMiddleware(bot)
    setupHandlers(bot)
    dataSourceDatabase
        .initialize()
        .then(() => {
            log.debug('Successfully connected to database')
        })
        .catch((e) => log.fatal('Error while connect to database ', e))
}
