import {NextFunction} from 'grammy'
import {log} from "@/utils/logger";
import {User} from "@/database/models/user";
import {userRepository} from "@/database";

export const userMiddleware = async (ctx, next: NextFunction) => {
    if (ctx.from.is_bot || (ctx.from?.id !== ctx.chat?.id)) return null

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
        user.balance = 1_000
        // ctx.user.balance = 0
        await userRepository.save(user)
    }

    ctx.user = user
    ctx.user.balance = Number(ctx.user.balance) // but balance is BigInt..

    return next()
}