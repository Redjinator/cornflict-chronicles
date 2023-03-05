import Victor from "victor";

export function randomSpawnPoint() {
    let edge = Math.floor(Math.random() * 4);
    let spawnPoint = new Victor(0, Math.random() * 100);
    switch(edge) {
        case 0: // top
        spawnPoint.x = Math.floor(Math.random() * 1280);
        break;
        case 1: // right
        spawnPoint.x = 1280;
        spawnPoint.y = Math.floor(Math.random() * 720);
        break;
        case 2: // bottom
        spawnPoint.x = Math.floor(Math.random() * 1280);
        spawnPoint.y = 720;
        break;
        default: // left
        spawnPoint.x = 0;
        spawnPoint.y = Math.floor(Math.random() * 720);
        break;
    }
    return spawnPoint;
}