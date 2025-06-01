import {Bot, Composer} from 'grammy'

import { composer as other } from './other'
import { composer as profile } from './profile'
import { composer as game } from './game'
import { composer as moderation } from './moderation'
import { composer as admin } from './admin'

import { composer as errorBoundary } from './other/errorBoundary'
import {allScenes} from "@/handlers/scenes";
import {Context} from "@/database/models/context";
import {chatMiddleware} from "@/middlewares/chat";
import {adminMiddleware} from "@/middlewares/admin";


export function setupHandlers(bot: Bot) {
    try {
        const composer = new Composer<Context>()
        composer.use()
        composer.use(errorBoundary)


        composer.use(chatMiddleware)
        composer.use(allScenes.manager())

        composer.use(other)
        composer.use(profile)
        composer.use(game)

        composer.use(moderation)

        composer.use(allScenes)

        composer.use(adminMiddleware)
        composer.use(admin)



        bot.use(composer)
    } catch (e) {
        console.log(e)
    }
}
