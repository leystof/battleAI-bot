import {parseMode} from '@grammyjs/parse-mode'

import {UserMiddleware} from '@/middlewares'

import {bot} from './bot'
import { setupSession } from './setupSession'
import {setupHandlers} from "@/handlers";
import {prisma} from "@/database/prisma";
import {log} from "@/utils/logger";


export function beforeStart() {
    bot.api.config.use(parseMode('HTML'))
    // bot.api.config.use(apiThrottler())
    setupSession(bot)
    UserMiddleware(bot)
    setupHandlers(bot)
    prisma.$connect()
        .then(() => {
            log.info("✅ Connected to prisma")
        })
        .catch((err) => {
            console.error('❌ Error connect to prisma:', err)
            process.exit(1)
        })
}
