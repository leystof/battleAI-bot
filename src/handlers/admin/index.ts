import { Composer } from 'grammy'

import {composer as notification} from "@/handlers/admin/notification";
import {composer as menu} from "@/handlers/admin/menu";

export const composer = new Composer()
composer.use(notification)
composer.use(menu)

