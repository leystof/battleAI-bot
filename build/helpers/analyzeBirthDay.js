"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeBirthDay = void 0;
const analyzeDayOrMonth_1 = require("../helpers/analyzeDayOrMonth");
const analyzeYear_1 = require("../helpers/analyzeYear");
const removeTrailingZero_1 = require("../helpers/removeTrailingZero");
function analyzeBirthDay(day, month, year) {
    const dayResult = (0, analyzeDayOrMonth_1.analyzeDayOrMonth)(day);
    const monthResult = (0, analyzeDayOrMonth_1.analyzeDayOrMonth)(month);
    const yearResult = Number(String((0, analyzeYear_1.analyzeYear)(year)));
    const endeavor = dayResult + monthResult + yearResult;
    const z = (String(day).split('')[0] === '0') ? String(day).split('')[1] : String(day).split('')[0];
    const dar = endeavor - (Number(z) * 2);
    let result = 0;
    for (const letter of String(dar).split('')) {
        result += Number(letter);
    }
    let endeavorResult = 0;
    for (const letter of String(endeavor).split('')) {
        endeavorResult += Number(letter);
    }
    endeavorResult = (0, removeTrailingZero_1.removeTrailingZero)(endeavorResult);
    const a = year.split('');
    const RESULT = Number(String(endeavorResult) + String(a[a.length - 1]));
    return {
        birthDay: `${day}.${month}.${year}`,
        result,
        endeavor,
        endeavorResult: endeavorResult,
        dar,
        RESULT
    };
}
exports.analyzeBirthDay = analyzeBirthDay;
