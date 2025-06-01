import { Bot } from 'grammy'

import { userMiddleware } from './user'
import {poolMiddleware} from "@/middlewares/pool";
import {moderationMiddleware} from "@/middlewares/moderation";
import {chatMiddleware} from "@/middlewares/chat";
import {stopMiddleware} from "@/middlewares/stop";

export function UserMiddleware(bot: Bot) {
    bot.use(userMiddleware)
}

export function ModerationMiddleware(bot: Bot) {
    bot.use(moderationMiddleware)
}

export function StopMiddleware(bot: Bot) {
    bot.use(stopMiddleware)
}

export function PoolMiddleware(bot: Bot) {
    bot.use(poolMiddleware)
}

