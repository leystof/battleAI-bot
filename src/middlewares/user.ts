import {NextFunction} from 'grammy'

export const userMiddleware = async (ctx, next: NextFunction) => {
    return next()
}