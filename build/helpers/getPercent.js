"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPercent = void 0;
function getPercent(amount, percent) {
    return Number(((amount * percent) / 100).toFixed(0));
}
exports.getPercent = getPercent;
