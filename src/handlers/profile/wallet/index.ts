import { Composer } from 'grammy'

import {composer as menu} from "@/handlers/profile/wallet/menu";
import {composer as topUpBalance} from "@/handlers/profile/wallet/topUpBalance";
import {composer as cancelInvoice} from "@/handlers/profile/wallet/cancelInvoice";

export const composer = new Composer()
composer.use(menu)
composer.use(topUpBalance)
composer.use(cancelInvoice)

