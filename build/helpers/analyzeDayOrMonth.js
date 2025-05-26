"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeDayOrMonth = void 0;
function analyzeDayOrMonth(number) {
    const letters = number.toUpperCase().split('');
    let numResult = 0;
    for (const letter of letters) {
        numResult += Number(letter);
    }
    return numResult;
}
exports.analyzeDayOrMonth = analyzeDayOrMonth;
