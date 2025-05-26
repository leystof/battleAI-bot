"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeTrailingZero = void 0;
function removeTrailingZero(num) {
    const str = String(num);
    if (str.endsWith('0')) {
        return parseInt(str.slice(0, -1)); // Убираем последний символ и приводим обратно к числу
    }
    return num;
}
exports.removeTrailingZero = removeTrailingZero;
