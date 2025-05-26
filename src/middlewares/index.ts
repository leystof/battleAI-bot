import { Bot } from 'grammy'

import { userMiddleware } from './user'
import {poolMiddleware} from "@/middlewares/pool";

export function UserMiddleware(bot: Bot) {
    bot.use(userMiddleware)
}

export function PoolMiddleware(bot: Bot) {
    bot.use(poolMiddleware)
}

