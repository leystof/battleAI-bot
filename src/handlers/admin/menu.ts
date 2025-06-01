import {Composer} from "grammy";
import {Context} from "@/database/models/context";

export const composer = new Composer<Context>()
composer.command("admin", start)

async function start(ctx: Context) {
    return ctx.reply(`Админ-панель beta`, {
        reply_markup: {
            inline_keyboard: [
                [{text: "Рассылка", callback_data: "admin notifications"}]
            ]
        }
    })
}
