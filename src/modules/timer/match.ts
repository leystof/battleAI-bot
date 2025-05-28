export const matchTimers = new Map<number, NodeJS.Timeout>();

export function setMatchTimer(matchId: number, fn: () => void | Promise<void>, delay: number) {
    const timer = setTimeout(async () => {
        try {
            await fn();
        } catch (error) {
            console.error(`Ошибка в таймере матча ${matchId}:`, error);
        } finally {
            matchTimers.delete(matchId); // автоудаление после выполнения
        }
    }, delay);

    matchTimers.set(matchId, timer);
}

export function clearMatchTimer(matchId: number) {
    const timer = matchTimers.get(matchId);
    if (timer) {
        clearTimeout(timer);
        matchTimers.delete(matchId);
    }
}