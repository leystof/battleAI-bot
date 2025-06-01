import { Composer } from 'grammy'

import {composer as menu} from "@/handlers/profile/wallet/menu";
import {composer as topUpBalance} from "@/handlers/profile/wallet/topUpBalance";
import {composer as cancelInvoice} from "@/handlers/profile/wallet/cancelInvoice";
import {composer as topUpBalanceAnotherValue} from "@/handlers/profile/wallet/topUpBalanceAnotherValue";
import {composer as withdrawBalance} from "@/handlers/profile/wallet/withdrawBalance";
import {composer as wagerHelp} from "@/handlers/profile/wallet/wagerHelp";


export const composer = new Composer()
composer.use(menu)
composer.use(topUpBalance)
composer.use(cancelInvoice)
composer.use(topUpBalanceAnotherValue)
composer.use(withdrawBalance)
composer.use(wagerHelp)

