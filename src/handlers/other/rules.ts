import {Composer, InlineKeyboard, Keyboard} from "grammy";
import {Context} from "@/database/models/context";


export const composer = new Composer<Context>()
composer.hears('❓ Правила', start)

const text = () => {
    return `<b>🎮 Правила игры</b>

<b>📝 Промпт режим:</b>
• ИИ генерирует изображение
• Опишите то, что видите максимально точно
• Побеждает тот, кто точнее опишет картинку

<b>🏷️ Тэг режим:</b>
• ИИ генерирует изображение и выделяет 6 ключевых слов
• Выберите 6 слов из 24 предложенных
• Побеждает тот, кто выберет больше правильных слов

<b>Общие правила:</b>
1. Выберите сумму ставки (100, 500, 1000 или 5000 руб)
2. Дождитесь соперника с такой же ставкой
3. Выполните задание в выбранном режиме
4. Победитель получает ставку соперника
5. 10% от каждой игры идет в счет платформы

Удачи в игре! 🍀

Если у вас возникли вопросы, обратитесь в онлайн поддержку: @BattleAI_support_bot`
}

const keyb = () => {
    return new InlineKeyboard()
        .url("📞 Связаться с поддержкой", "https://t.me/BattleAI_support_bot")
}
async function start(ctx) {
    return ctx.reply(text(),{
        reply_markup: keyb()
    })
}
