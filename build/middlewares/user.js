"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMiddleware = void 0;
const logger_1 = require("../utils/logger");
const user_1 = require("../database/models/user");
const database_1 = require("../database");
const userMiddleware = async (ctx, next) => {
    if (ctx.from.is_bot || (ctx.from?.id !== ctx.chat?.id))
        return null;
    logger_1.log.debug('Handle user middleware');
    const id = ctx?.from?.id;
    let user;
    user = await database_1.userRepository.findOne({
        where: {
            tgId: ctx.from.id,
        }
    });
    if (!user) {
        user = new user_1.User();
        user.tgId = id;
        await database_1.userRepository.save(user);
    }
    ctx.user = user;
    return next();
};
exports.userMiddleware = userMiddleware;
