"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsername = void 0;
const bot_1 = require("../utils/bot");
async function getUsername(user) {
    const userTelegramData = await bot_1.bot.api.getChat(user?.tgId)
        .catch(() => {
        return 'please update username';
    });
    // @ts-ignore
    return `<a href="tg://user?id=${user.tgId}">${"first_name" in userTelegramData ? userTelegramData?.first_name : 'none'}</a> `;
}
exports.getUsername = getUsername;
