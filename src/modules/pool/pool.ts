import { Mutex } from 'async-mutex'
import {MatchType} from "@/database/models/game/match";
import {bot} from "@/utils/bot";
import {log} from "@/utils/logger";

export type Player = {
    userId: number
    tgId: number
    msgId?: number
    type: MatchType
    bet: number
    joinedAt: number
}

export class PlayerPool {
    private pool: Player[] = []
    private activePlayers = new Set<number>()
    private mutex = new Mutex()
    private ttl = 60 * 60 * 1000 // 1 час
    private cleanupInterval: NodeJS.Timeout

    constructor() {
        this.cleanupInterval = setInterval(() => {
            this.cleanupExpiredPlayers().catch(log.error)
        }, 10_000)
    }

    addPlayer(player: Player) {
        if (this.isInPool(player.userId)) return
        this.pool.push({ ...player, joinedAt: Date.now() })
    }

    removePlayer(userId: number) {
        this.pool = this.pool.filter(p => p.userId !== userId)
        this.activePlayers.delete(userId)
    }

    async getReadyPair(): Promise<[Player, Player] | null> {
        return await this.mutex.runExclusive(() => {
            for (let i = 0; i < this.pool.length; i++) {
                const p1 = this.pool[i]

                for (let j = i + 1; j < this.pool.length; j++) {
                    const p2 = this.pool[j]

                    const sameBet = p1.bet === p2.bet
                    const sameType = p1.type === p2.type

                    if (sameBet && sameType) {
                        this.pool.splice(j, 1)
                        this.pool.splice(i, 1)

                        this.activePlayers.add(p1.userId)
                        this.activePlayers.add(p2.userId)

                        return [p1, p2]
                    }
                }
            }

            return null
        })
    }


    markGameFinished(p1: number, p2: number) {
        this.activePlayers.delete(p1)
        this.activePlayers.delete(p2)
    }

    isInPool(userId: number) {
        return this.pool.some(p => p.userId === userId)
    }

    isInMatch(userId: number) {
        return this.activePlayers.has(userId)
    }

    getPoolSize() {
        return this.pool.length
    }


    private async cleanupExpiredPlayers() {
        await this.mutex.runExclusive(() => {
            const now = Date.now()
            const kept: Player[] = []

            for (const player of this.pool) {
                const expired = now - player.joinedAt > this.ttl

                if (expired) {
                    bot.api.sendMessage(
                        player.tgId,
                        '⏳ Время ожидания истекло. Поиск был остановлен.'
                    ).catch(() => {
                        log.warn(`⚠️ Не удалось отправить сообщение userId=${player.userId}`)
                    })
                } else {
                    kept.push(player)
                }
            }

            this.pool = kept
        })
    }


    shutdown() {
        clearInterval(this.cleanupInterval)
    }
}
