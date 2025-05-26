"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeYear = void 0;
function analyzeYear(number) {
    const letters = number.toUpperCase().split('');
    let firstPair = 0;
    let lastPair = 0;
    for (const i in letters) {
        let letter = letters[i];
        if (Number(i) >= 2) {
            firstPair += Number(letter);
        }
        else {
            lastPair += Number(letter);
        }
    }
    return firstPair + lastPair;
}
exports.analyzeYear = analyzeYear;
