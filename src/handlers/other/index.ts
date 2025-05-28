import { Composer } from 'grammy'

import {composer as start} from "@/handlers/other/start";
import {composer as channel} from "@/handlers/other/channel";
import {composer as rules} from "@/handlers/other/rules";
import {composer as deleteMessage} from "@/handlers/other/deleteMessage";

export const composer = new Composer()
composer.use(start)
composer.use(channel)
composer.use(rules)
composer.use(deleteMessage)

