"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoolMiddleware = exports.UserMiddleware = void 0;
const user_1 = require("./user");
const pool_1 = require("../middlewares/pool");
function UserMiddleware(bot) {
    bot.use(user_1.userMiddleware);
}
exports.UserMiddleware = UserMiddleware;
function PoolMiddleware(bot) {
    bot.use(pool_1.poolMiddleware);
}
exports.PoolMiddleware = PoolMiddleware;
