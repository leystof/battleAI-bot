import {NextFunction} from 'grammy'
import {log} from "@/utils/logger";
import {User} from "@/database/models/user/user";
import {userRepository} from "@/database";
import {firstStart} from "@/handlers/other/start";

export const userMiddleware = async (ctx, next: NextFunction) => {
    if (ctx.from.is_bot) return null

    log.debug('Handle user middleware')
    const id = ctx?.from?.id

    let user: User
    user = await userRepository.findOne({
        where: {
            tgId: ctx.from.id,
        }
    })

    if (!user) {
        user = new User()
        user.tgId = id
        await userRepository.save(user)

        ctx.user = user
        return firstStart(ctx)
    }

    ctx.user = user

    return next()
}