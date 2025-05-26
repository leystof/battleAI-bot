"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.beforeStart = void 0;
const parse_mode_1 = require("@grammyjs/parse-mode");
const middlewares_1 = require("../middlewares");
const bot_1 = require("./bot");
const setupSession_1 = require("./setupSession");
const handlers_1 = require("../handlers");
const prisma_1 = require("../database/prisma");
const logger_1 = require("../utils/logger");
function beforeStart() {
    bot_1.bot.api.config.use((0, parse_mode_1.parseMode)('HTML'));
    // bot.api.config.use(apiThrottler())
    (0, setupSession_1.setupSession)(bot_1.bot);
    (0, middlewares_1.UserMiddleware)(bot_1.bot);
    (0, handlers_1.setupHandlers)(bot_1.bot);
    prisma_1.prisma.$connect()
        .then(() => {
        logger_1.log.info("✅ Connected to prisma");
    })
        .catch((err) => {
        console.error('❌ Error connect to prisma:', err);
        process.exit(1);
    });
}
exports.beforeStart = beforeStart;
