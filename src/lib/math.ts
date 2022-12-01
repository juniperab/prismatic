export function bounded(value: number, floor: number, ceiling: number) {
    return Math.min(Math.max(value, floor), ceiling)
}