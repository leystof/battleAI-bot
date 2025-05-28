import { Composer } from 'grammy'

import {composer as menu} from "@/handlers/profile/menu";
import {composer as swapNicknameVisibility} from "@/handlers/profile/swapNicknameVisibility";
import {composer as wallet} from "@/handlers/profile/wallet";

export const composer = new Composer()
composer.use(menu)
composer.use(swapNicknameVisibility)
composer.use(wallet)

