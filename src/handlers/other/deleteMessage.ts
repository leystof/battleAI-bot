import {Context} from "@/database/models/context";
import {Composer} from "grammy";

export const composer = new Composer<Context>()
composer.callbackQuery('deleteMessage', async (ctx) => { try {await ctx.deleteMessage()} catch (e) {} })