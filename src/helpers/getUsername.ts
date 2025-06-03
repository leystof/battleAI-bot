import {User} from "@/database/models/user/user";
import {bot} from "@/utils/bot";

export async function getUsername(user: User, isVisibility: boolean = true): Promise<string> {
    try {
        const userTelegramData = await bot.api.getChat(user?.tgId)
            .catch(() => {
                return null;
            });

        if (!isVisibility) {
            return `#hide`;
        }
        // @ts-ignore
        return `<a href="tg://user?id=${user.tgId}">${"first_name" in userTelegramData ? userTelegramData?.first_name : 'none'}</a> `;
    } catch (e) {
        console.log(e)
        return "#null"
    }
}