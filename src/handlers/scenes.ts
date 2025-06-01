import {ScenesComposer} from "grammy-scenes";
import {Context} from "@/database/models/context";
import {scene as topUpBalance} from "@/handlers/profile/wallet/topUpBalanceAnotherValue";
import {scene as withdrawBalance} from "@/handlers/profile/wallet/withdrawBalance";
import {scene as notification} from "@/handlers/admin/notification/scene";

export const allScenes = new ScenesComposer<Context>()
allScenes.scene(topUpBalance)
allScenes.scene(withdrawBalance)
allScenes.scene(notification)
