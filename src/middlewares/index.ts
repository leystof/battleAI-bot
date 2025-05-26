import { Bot } from 'grammy'

import { userMiddleware } from './user'

export function UserMiddleware(bot: Bot) {
    bot.use(userMiddleware)
}

