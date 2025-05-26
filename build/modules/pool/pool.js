"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerPool = void 0;
const async_mutex_1 = require("async-mutex");
const bot_1 = require("../../utils/bot");
const logger_1 = require("../../utils/logger");
class PlayerPool {
    pool = [];
    activePlayers = new Set();
    mutex = new async_mutex_1.Mutex();
    ttl = 60 * 60 * 1000; // 1 час
    cleanupInterval;
    constructor() {
        this.cleanupInterval = setInterval(() => {
            this.cleanupExpiredPlayers().catch(logger_1.log.error);
        }, 10000);
    }
    addPlayer(player) {
        if (this.isInPool(player.userId))
            return;
        this.pool.push({ ...player, joinedAt: Date.now() });
    }
    removePlayer(userId) {
        this.pool = this.pool.filter(p => p.userId !== userId);
        this.activePlayers.delete(userId);
    }
    async getReadyPair() {
        return await this.mutex.runExclusive(() => {
            for (let i = 0; i < this.pool.length; i++) {
                const p1 = this.pool[i];
                for (let j = i + 1; j < this.pool.length; j++) {
                    const p2 = this.pool[j];
                    const sameBet = p1.bet === p2.bet;
                    const sameType = p1.type === p2.type;
                    if (sameBet && sameType) {
                        this.pool.splice(j, 1);
                        this.pool.splice(i, 1);
                        this.activePlayers.add(p1.userId);
                        this.activePlayers.add(p2.userId);
                        return [p1, p2];
                    }
                }
            }
            return null;
        });
    }
    markGameFinished(p1, p2) {
        this.activePlayers.delete(p1);
        this.activePlayers.delete(p2);
    }
    isInPool(userId) {
        return this.pool.some(p => p.userId === userId);
    }
    isInMatch(userId) {
        return this.activePlayers.has(userId);
    }
    getPoolSize() {
        return this.pool.length;
    }
    async cleanupExpiredPlayers() {
        await this.mutex.runExclusive(() => {
            const now = Date.now();
            const kept = [];
            for (const player of this.pool) {
                const expired = now - player.joinedAt > this.ttl;
                if (expired) {
                    bot_1.bot.api.sendMessage(player.tgId, '⏳ Время ожидания истекло. Поиск был остановлен.').catch(() => {
                        logger_1.log.warn(`⚠️ Не удалось отправить сообщение userId=${player.userId}`);
                    });
                }
                else {
                    kept.push(player);
                }
            }
            this.pool = kept;
        });
    }
    shutdown() {
        clearInterval(this.cleanupInterval);
    }
}
exports.PlayerPool = PlayerPool;
