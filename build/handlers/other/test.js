"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const analyzeWord_1 = require("../../helpers/analyzeWord");
const analyzeBirthDay_1 = require("../../helpers/analyzeBirthDay");
const removeTrailingZero_1 = require("../../helpers/removeTrailingZero");
const config_1 = require("../../utils/config");
exports.composer = new grammy_1.Composer();
exports.composer.command('test', start);
async function start(ctx) {
    const lastNameResult = (0, analyzeWord_1.analyzeWord)("Михайлов");
    const firstNameResult = (0, analyzeWord_1.analyzeWord)("Олег");
    const patronymicResult = (0, analyzeWord_1.analyzeWord)("Андреевич");
    const birthDayResult = (0, analyzeBirthDay_1.analyzeBirthDay)("24", "11", "1982");
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
    `, {
        reply_markup: {
            inline_keyboard: [
                [{ text: "Получить расшифровку за 356 рублей", url: `https://t.me/${config_1.config.support}` }],
                [{ text: "Записаться на консультацию", url: `https://t.me/${config_1.config.support}` }]
            ]
        }
    });
}
