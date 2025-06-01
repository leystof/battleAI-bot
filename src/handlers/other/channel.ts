import {Composer, InlineKeyboard, Keyboard} from "grammy";
import {Context} from "@/database/models/context";
import {configRepository} from "@/database";
import {Config} from "@/database/models/config";

export const composer = new Composer<Context>()
composer.hears('📢 Каналы', start)

const text = () => {
    return "Каналы проекта:"
}

const keyb = (config: Config) => {
    return new InlineKeyboard()
        .url("🟢 Live победители", config.channelLiveUrl)
}
async function start(ctx) {
    const config = await configRepository.findOne({
        where: {
            id: 1
        }
    })
    return ctx.reply(text(),{
        reply_markup: keyb(config)
    })
}
