import { hitTestRectangle } from "../helpers/collisions";

export function moveBullets(
  bullets,
  enemies,
  scoreboard,
  gameScene,
  width,
  height,
  farmerDelta,
  farmer,
  dropPowerUpCallback
) {
  for (let i = 0; i < bullets.length; i++) {
    let bullet = bullets[i];
    if (bullet.parent) {
      moveBullet(bullet, farmerDelta);
      checkBulletCollision(bullet, enemies, scoreboard, gameScene, dropPowerUpCallback);
      removeBullet(bullet, gameScene, width, height);
    }
  }
}

function moveBullet(bullet, farmerDelta) {
  bullet.x += bullet.vx - farmerDelta.x;
  bullet.y += bullet.vy - farmerDelta.y;
}

function checkBulletCollision(bullet, enemies, scoreboard, gameScene, dropPowerUpCallback) {
  for (let j = 0; j < enemies.length; j++) {
    let enemy = enemies[j];
    if (hitTestRectangle(bullet, enemy)) {
      scoreboard.increaseScore();

      // Drop power-up at enemy position
      if (dropPowerUpCallback) {
        dropPowerUpCallback(enemy.x, enemy.y);
      }

      gameScene.removeChild(bullet);
      gameScene.removeChild(enemy);
      enemies.splice(j, 1);
      let popSound = getRandomPopSound();
      popSound.volume = 1;
      popSound.play();
      break;
    }
  }
}

function removeBullet(bullet, gameScene, width, height) {
  if (bullet.x < 0 || bullet.x > width || bullet.y < 0 || bullet.y > height) {
    gameScene.removeChild(bullet);
  }
}

function getRandomPopSound() {
  const popSounds = ["/audio/pop1.wav", "/audio/pop2.wav", "/audio/pop3.wav"];

  const randomIndex = Math.floor(Math.random() * popSounds.length);
  return new Audio(popSounds[randomIndex]);
}
