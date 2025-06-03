import {NextFunction} from 'grammy'
import {Context} from "@/database/models/context";
import {getCachedConfig} from "@/modules/cache/config";

export const stopMiddleware = async (ctx: Context, next: NextFunction) => {
    const config = await getCachedConfig()

    if (config.stop) {
        return ctx.reply(`
⛔️ <b>Бот на техническом обслуживании, попробуйте позже</b>
        `)
    }
    return next();
}