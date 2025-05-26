"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bot = void 0;
const grammy_1 = require("grammy");
const config_1 = require("./config");
exports.bot = new grammy_1.Bot(config_1.config.bot.apiKey);
exports.bot.catch((e) => console.log(e));
