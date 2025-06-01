import { Composer } from 'grammy'

import {composer as accept} from "@/handlers/moderation/payments/accept";
import {composer as cancel} from "@/handlers/moderation/payments/cancel";

export const composer = new Composer()
composer.use(accept)
composer.use(cancel)

