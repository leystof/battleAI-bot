"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeWord = void 0;
const numerology_1 = require("../helpers/numerology");
function analyzeWord(word) {
    const letters = word.toUpperCase().split('');
    let letterNumber = 0;
    for (const letter of letters) {
        letterNumber += numerology_1.numerology.get(letter);
    }
    const letterResultNumber = String(letterNumber).toUpperCase().split('');
    return {
        info: letterResultNumber,
        result: Number(String(Number(letterResultNumber[0]) + Number(letterResultNumber[1])).split('')[0] + String(numerology_1.numerology.get(letters[letters.length - 1])))
    };
}
exports.analyzeWord = analyzeWord;
