import { Composer } from 'grammy'

import {composer as menu} from "@/handlers/profile/wallet/menu";
import {composer as topUpBalance} from "@/handlers/profile/wallet/topUpBalance";

export const composer = new Composer()
composer.use(menu)
composer.use(topUpBalance)

