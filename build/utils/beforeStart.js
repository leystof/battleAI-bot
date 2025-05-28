"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.beforeStart = void 0;
const parse_mode_1 = require("@grammyjs/parse-mode");
const middlewares_1 = require("../middlewares");
const bot_1 = require("./bot");
const setupSession_1 = require("./setupSession");
const handlers_1 = require("../handlers");
const logger_1 = require("../utils/logger");
const database_1 = require("../database");
const transformer_throttler_1 = require("@grammyjs/transformer-throttler");
function beforeStart() {
    bot_1.bot.api.config.use((0, parse_mode_1.parseMode)('HTML'));
    bot_1.bot.api.config.use((0, transformer_throttler_1.apiThrottler)({
        global: {
            reservoir: 28,
            reservoirRefreshAmount: 28,
            reservoirRefreshInterval: 1000,
        },
        group: {
            reservoir: 5,
            reservoirRefreshAmount: 5,
            reservoirRefreshInterval: 1000,
        },
        out: {
            reservoir: 1,
            reservoirRefreshAmount: 1,
            reservoirRefreshInterval: 1000,
        }
    }));
    (0, setupSession_1.setupSession)(bot_1.bot);
    (0, middlewares_1.UserMiddleware)(bot_1.bot);
    (0, middlewares_1.PoolMiddleware)(bot_1.bot);
    (0, handlers_1.setupHandlers)(bot_1.bot);
    database_1.dataSourceDatabase
        .initialize()
        .then(() => {
        logger_1.log.debug('Successfully connected to database');
    })
        .catch((e) => logger_1.log.fatal('Error while connect to database ', e));
}
exports.beforeStart = beforeStart;
