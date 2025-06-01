import {NextFunction} from 'grammy'
import {Context} from "@/database/models/context";

export const moderationMiddleware = async (ctx: Context, next: NextFunction) => {
    if (!ctx.user.moderation || !ctx.user.admin) return

    return next()
}