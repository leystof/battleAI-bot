import {NextFunction} from 'grammy'
import {Context} from "@/database/models/context";

export const adminMiddleware = async (ctx: Context, next: NextFunction) => {
    if (!ctx.user.admin) return

    return next()
}