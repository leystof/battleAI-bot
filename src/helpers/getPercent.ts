export function getPercent(amount: number, percent: number): number {
    return Number(((amount * percent) / 100).toFixed(0));
}
