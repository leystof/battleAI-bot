"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scene = exports.startAnalyzeScene = exports.composer = void 0;
const grammy_1 = require("grammy");
const grammy_scenes_1 = require("grammy-scenes");
const analyzeWord_1 = require("../../helpers/analyzeWord");
const analyzeBirthDay_1 = require("../../helpers/analyzeBirthDay");
const removeTrailingZero_1 = require("../../helpers/removeTrailingZero");
exports.composer = new grammy_1.Composer();
exports.composer.callbackQuery('analyze start', startAnalyzeScene);
async function startAnalyzeScene(ctx) {
    return ctx.scenes.enter('analyze start');
}
exports.startAnalyzeScene = startAnalyzeScene;
exports.scene = new grammy_scenes_1.Scene('analyze start');
exports.scene.do(async (ctx) => {
    await ctx.reply(`<b>👤 Введите ФИО

<code>Пример: Семенова Кристина Артуровна</code></b>`);
    ctx.scene.resume();
});
exports.scene.wait().on(":text", async (ctx) => {
    const match = /([\u0400-\u04FF]+)\s+([\u0400-\u04FF]+)\s+([\u0400-\u04FF]+)/u.exec(ctx.message.text);
    if (!match)
        return ctx.reply(`<b>⚠️ Неверный формат\n\n<code>Пример: Семенова Кристина Артуровна</code></b>`);
    ctx.session.lastName = match[1];
    ctx.session.firstName = match[2];
    ctx.session.patronymic = match[3];
    await ctx.reply(`<b>📅 Введите дату рождения\n\n<code>Пример: 12.07.1993</code></b>`);
    // @ts-ignore
    ctx.scene.resume();
});
exports.scene.wait().on(":text", async (ctx) => {
    const match = /(\d\d)\.(\d\d)\.(\d\d\d\d)/u.exec(ctx.message.text);
    if (!match)
        return ctx.reply(`<b>⚠️ Неверный формат\n\n<code>Пример: 12.07.1993</code></b>`);
    ctx.session.birthDay = `${match[1]}.${match[2]}.${match[3]}`;
    const lastNameResult = (0, analyzeWord_1.analyzeWord)(ctx.session.lastName);
    const firstNameResult = (0, analyzeWord_1.analyzeWord)(ctx.session.firstName);
    const patronymicResult = (0, analyzeWord_1.analyzeWord)(ctx.session.patronymic);
    const birthDayResult = (0, analyzeBirthDay_1.analyzeBirthDay)(match[1], match[2], match[3]);
    await ctx.reply(`
<b>✨ Результат:</b>

<b>Фамилия:</b>
    ${lastNameResult.info[0] + lastNameResult.info[1]} = ${(0, removeTrailingZero_1.removeTrailingZero)(Number(lastNameResult.info[0]) + Number(lastNameResult.info[1]))}
    Итог родовой программы ${lastNameResult.result}
<b>Имя:</b>
    ${firstNameResult.info[0] + firstNameResult.info[1]} = ${(0, removeTrailingZero_1.removeTrailingZero)(Number(firstNameResult.info[0]) + Number(firstNameResult.info[1]))}
    Итог личность ${firstNameResult.result}
<b>Отчество:</b> 
    ${patronymicResult.info[0] + patronymicResult.info[1]} = ${(0, removeTrailingZero_1.removeTrailingZero)(Number(patronymicResult.info[0]) + Number(patronymicResult.info[1]))}
    Итог адоптация ${patronymicResult.result}

<b>Дата рождения </b> 
    ${birthDayResult.birthDay}=${birthDayResult.endeavor}=${birthDayResult.endeavorResult}=${birthDayResult.dar}=${birthDayResult.result}
    Стремление ${birthDayResult.endeavor} = ${birthDayResult.endeavorResult}
    Дар ${birthDayResult.dar} = ${birthDayResult.result} 
    
<b>Программа матрицы прихода итоговая ${birthDayResult.RESULT}</b> 
    `);
});
