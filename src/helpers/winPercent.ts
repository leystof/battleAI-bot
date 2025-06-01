export function getWinPercent(win: number, lost: number): number {
    const total = win + lost;
    if (total === 0) return 0;
    return Math.round((win / total) * 100);
}
