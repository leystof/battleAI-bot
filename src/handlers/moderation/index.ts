import { Composer } from 'grammy'

import {composer as payments} from "@/handlers/moderation/payments";

export const composer = new Composer()
composer.use(payments)

