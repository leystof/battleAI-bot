"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
exports.composer = new grammy_1.Composer();
exports.composer.hears('👤 Профиль', start);
const text = () => {
    return `👤 Ваш профиль

ID: 43
Имя: Ihor
Баланс: 0 ₽
Доступный баланс: 0 ₽
Зарезервировано: 0 ₽
Статус: ✅ Аккаунт активен
Отображение никнейма: 👁 Видимо

📊 Статистика
Игр сыграно: 0
Побед: 0
Процент побед: 0%
Всего заработано: 0 ₽

🏆 Ранг: 🔰 Новичок
🔢 Очки: 0
📈 Прогресс: 0%`;
};
const keyb = () => {
    return new grammy_1.InlineKeyboard()
        .text("🙈 Скрыть никнейм", "profile hide nickname").row()
        .text("👥 Реферальная программа", "refferal menu");
};
async function start(ctx) {
    return ctx.reply(text(), {
        reply_markup: keyb()
    });
}
