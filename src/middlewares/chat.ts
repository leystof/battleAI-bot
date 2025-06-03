import {NextFunction} from 'grammy'
import {Context} from "@/database/models/context";
import {getCachedConfig} from "@/modules/cache/config";
import {UserStatus} from "@/database/models/user/user";

export const chatMiddleware = async (ctx: Context, next: NextFunction) => {
    if (!ctx.chat) return;


    if (ctx.user.status === UserStatus.BAN) {
        return ctx.reply("Вы забанены.")
    }

    if (ctx.chat.id === ctx.from.id) {
        return next();
    }

    const config = await getCachedConfig()

    if (!config) return;

    const allowedChatIds = [
        Number(config.channelLiveId),
        Number(config.channelCallbackId),
        Number(config.channelInvoiceId),
        Number(config.channelPayOutId),
        Number(config.channelModerationPayOutId)
    ];

    if (allowedChatIds.includes(ctx.chat.id)) {
        return next();
    }

    return;
}