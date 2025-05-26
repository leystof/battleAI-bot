import { Composer } from 'grammy'

import {composer as menu} from "@/handlers/profile/menu";

export const composer = new Composer()
composer.use(menu)

