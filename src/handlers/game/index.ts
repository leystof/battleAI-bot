import { Composer } from 'grammy'

import {composer as menu} from "@/handlers/game/menu";
import {composer as help} from "@/handlers/game/help";

import {composer as chooseBet} from "@/handlers/game/match/chooseBet";
import {composer as launch} from "@/handlers/game/match/launch";
import {composer as cancel} from "@/handlers/game/match/cancel";

export const composer = new Composer()
composer.use(menu)
composer.use(help)

composer.use(chooseBet)
composer.use(launch)
composer.use(cancel)

