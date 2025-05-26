import {beforeStart} from './utils/beforeStart'
import {bot} from "@/utils/bot";
import {run} from "@grammyjs/runner";

beforeStart()
bot.catch((e) => console.log(e))
run(bot).start()


