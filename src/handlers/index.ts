import {Bot, Composer} from 'grammy'

import { composer as other } from './other'
import { composer as profile } from './profile'
import { composer as game } from './game'
import { composer as errorBoundary } from './other/errorBoundary'
import {allScenes} from "@/handlers/scenes";
import {Context} from "@/database/models/context";


export function setupHandlers(bot: Bot) {
    try {
        const composer = new Composer<Context>()
        composer.use()
        composer.use(errorBoundary)

        composer.use(allScenes.manager())

        composer.use(other)
        composer.use(profile)
        composer.use(game)

        composer.use(allScenes)

        bot.use(composer)
    } catch (e) {
        console.log(e)
    }
}
