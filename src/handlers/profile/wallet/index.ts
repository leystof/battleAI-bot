import { Composer } from 'grammy'

import {composer as menu} from "@/handlers/profile/wallet/menu";
import {composer as cancelInvoice} from "@/handlers/profile/wallet/cancelInvoice";
import {composer as withdrawBalance} from "@/handlers/profile/wallet/withdrawBalance";
import {composer as wagerHelp} from "@/handlers/profile/wallet/wagerHelp";

import {composer as topup} from "@/handlers/profile/wallet/topup";


export const composer = new Composer()
composer.use(menu)
composer.use(cancelInvoice)
composer.use(withdrawBalance)
composer.use(wagerHelp)
composer.use(topup)

