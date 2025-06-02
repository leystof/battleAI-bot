import { configRepository } from "@/database";
import { Config } from "@/database/models/config";

let cachedConfig: Config | null = null;
let lastFetch = 0;
const CACHE_TTL = 30 * 1000; // 30 секунд

export async function getCachedConfig(): Promise<Config | null> {
    const now = Date.now();

    if (!cachedConfig || now - lastFetch > CACHE_TTL) {
        cachedConfig = await configRepository.findOne({ where: { id: 1 }, relations: [
            "paymentRubProvider", "withdrawRubProvider", "paymentUsdtProvider"
            ] });
        lastFetch = now;
    }

    return cachedConfig;
}