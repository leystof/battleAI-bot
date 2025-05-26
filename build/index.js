"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const beforeStart_1 = require("./utils/beforeStart");
const bot_1 = require("./utils/bot");
const runner_1 = require("@grammyjs/runner");
(0, beforeStart_1.beforeStart)();
bot_1.bot.catch((e) => console.log(e));
(0, runner_1.run)(bot_1.bot).start();
