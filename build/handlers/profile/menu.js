"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const user_1 = require("../../database/models/user");
exports.composer = new grammy_1.Composer();
exports.composer.hears('👤 Профиль', start);
const text = (ctx) => {
    return `👤 Ваш профиль

ID: ${ctx.user.id}
Имя: ${ctx.from.first_name}
Баланс: ${ctx.user.balance} ₽
На выводе: 0 ₽
Статус аккаунта: ${(ctx.user.status === user_1.UserStatus.ACTIVE) ? '✅ Активен' : '🟥 Заблокирован'}
Отображение никнейма: ${(ctx.user.usernameVisibility) ? '👁 Виден' : 'Скрыт 🙈'}

📊 Статистика
Игр сыграно: 0
Побед: 0
Процент побед: 0%
Всего заработано: 0 ₽`;
};
const keyb = (ctx) => {
    return new grammy_1.InlineKeyboard()
        .text((ctx.user.usernameVisibility) ? '🙈 Скрыть никнейм' : '👁 Открыть никнейм', "profile swap nickname visibility").row()
        .text("👥 Реферальная программа", "refferal menu");
};
async function start(ctx) {
    return ctx.reply(text(ctx), {
        reply_markup: keyb(ctx)
    });
}
