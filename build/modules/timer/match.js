"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearMatchTimer = exports.setMatchTimer = exports.matchTimers = void 0;
exports.matchTimers = new Map();
function setMatchTimer(matchId, fn, delay) {
    const timer = setTimeout(async () => {
        try {
            await fn();
        }
        catch (error) {
            console.error(`Ошибка в таймере матча ${matchId}:`, error);
        }
        finally {
            exports.matchTimers.delete(matchId);
        }
    }, delay);
    exports.matchTimers.set(matchId, timer);
}
exports.setMatchTimer = setMatchTimer;
function clearMatchTimer(matchId) {
    const timer = exports.matchTimers.get(matchId);
    if (timer) {
        clearTimeout(timer);
        exports.matchTimers.delete(matchId);
    }
}
exports.clearMatchTimer = clearMatchTimer;
