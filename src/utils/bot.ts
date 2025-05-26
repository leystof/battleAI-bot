import {Bot} from 'grammy'
import { config } from './config'
import {Context} from './context'


export const bot = new Bot<Context>(config.bot.apiKey)

bot.catch((e) => console.log(e))
