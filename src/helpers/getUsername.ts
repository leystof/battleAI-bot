import {User} from "@/database/models/user";
import {bot} from "@/utils/bot";

export async function getUsername(user: User): Promise<string> {
    const userTelegramData = await bot.api.getChat(user?.tgId)
        .catch(() => {
            return 'please update username'
        })

    // @ts-ignore
    return `<a href="tg://user?id=${user.tgId}">${"first_name" in userTelegramData ? userTelegramData?.first_name : 'none'}</a> `;
}