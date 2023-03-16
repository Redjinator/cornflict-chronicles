import { hitTestRectangle } from "../helpers/collisions";

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
                    let popSound = getRandomPopSound();
                    popSound.volume = 1;
                    popSound.play();
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

function getRandomPopSound() {
    const popSounds = [
        '/audio/pop1.wav',
        '/audio/pop2.wav',
        '/audio/pop3.wav',
    ];

    const randomIndex = Math.floor(Math.random() * popSounds.length);
        return new Audio(popSounds[randomIndex]);
}