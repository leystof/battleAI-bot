"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMiddleware = void 0;
const userMiddleware = async (ctx, next) => {
    return next();
};
exports.userMiddleware = userMiddleware;
