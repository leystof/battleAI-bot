import {beforeStart} from './utils/beforeStart'
import {bot} from "@/utils/bot";
import {run} from "@grammyjs/runner";

// Это mvp версия бота, которая легко масшабируется, сейчас я немного написал шит код
// который надо будет переписать

beforeStart()
bot.catch((e) => console.log(e))
run(bot).start()
