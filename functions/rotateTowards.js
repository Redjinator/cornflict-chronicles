export function rotateTowards(event, target) {
    return Math.atan2(event.data.global.y - target.y, event.data.global.x - target.x)
}