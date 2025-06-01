import {Composer, InlineKeyboard, Keyboard} from "grammy";
import {Context} from "@/database/models/context";
import {getCachedConfig} from "@/modules/cache/config";


export const composer = new Composer<Context>()
composer.hears('❓ Правила', start)

const text = (url: string) => {
    return `<b>🎮 Правила игры</b>

1. Выберите сумму ставки (100, 500, 1000 или 5000 руб).
2. После того, как найдется соперник с такой же ставкой, будет сгенерирована картинка.
3. Напишите наиболее точное описание картинки.
4. Игрок, чье описание будет наиболее точным, выигрывает ставку соперника.
5. 10% от каждой игры идет в счет платформы.

Удачи в игре! 🍀

Если у вас возникли вопросы, обратитесь в онлайн поддержку: ${url}`
}

const keyb = (url: string) => {
    return new InlineKeyboard()
        .url("📞 Связаться с поддержкой", url)
}
async function start(ctx) {
    const config = await getCachedConfig()
    return ctx.reply(text(config.supportUrl),{
        reply_markup: keyb(config.supportUrl)
    })
}
