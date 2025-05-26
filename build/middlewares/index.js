"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMiddleware = void 0;
const user_1 = require("./user");
function UserMiddleware(bot) {
    bot.use(user_1.userMiddleware);
}
exports.UserMiddleware = UserMiddleware;
