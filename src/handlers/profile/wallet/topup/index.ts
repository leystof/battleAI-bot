import { Composer } from 'grammy'

import {composer as chooseProvider} from "@/handlers/profile/wallet/topup/chooseProvider";
import {composer as topUpBalance} from "@/handlers/profile/wallet/topup/topUpBalance";
import {composer as topUpBalanceAnotherValue} from "@/handlers/profile/wallet/topup/topUpBalanceAnotherValue";


export const composer = new Composer()
composer.use(chooseProvider)
composer.use(topUpBalance)
composer.use(topUpBalanceAnotherValue)

