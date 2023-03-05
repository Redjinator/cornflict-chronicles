import { hitTestRectangle } from "./collisions";

export function moveBullets(bullets, enemies, scoreboard, gameScene, width, height, farmerDeltaX, farmerDeltaY) {
    for (let i=0; i<bullets.length; i++) {
        let bullet = bullets[i];
        if (bullet.parent) {
            bullet.x += bullet.vx - farmerDeltaX;
            bullet.y += bullet.vy - farmerDeltaY;

            // *Check for collision with enemies
            for (let j=0; j<enemies.length; j++) {
                let enemy = enemies[j];
                if (hitTestRectangle(bullet, enemy)) {
                    scoreboard.increaseScore();
                    gameScene.removeChild(bullet);
                    gameScene.removeChild(enemy);
                    enemies.splice(j, 1);
                    break;
                }
            }

            // *Remove bullets out of bounds
            if (bullet.x < 0 || bullet.x > width || bullet.y < 0 || bullet.y > height) {
                gameScene.removeChild(bullet);
            }
        }
    }
}