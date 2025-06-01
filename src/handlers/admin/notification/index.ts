import { Composer } from 'grammy'

import {composer as scene} from "@/handlers/admin/notification/scene";

export const composer = new Composer()
composer.use(scene)

