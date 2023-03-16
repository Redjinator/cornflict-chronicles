import { createBullet } from './bullet.js';

export function shoot(farmer, bullets, gameScene) {
  for (let i=0; i<bullets.length; i++) {
    let bullet = bullets[i];
    if (!bullet.parent) {
      bullet.x = farmer.x;
      bullet.y = farmer.y;
      bullet.rotation = farmer.rotation;
      bullet.vx = Math.cos(farmer.rotation) * 10;
      bullet.vy = Math.sin(farmer.rotation) * 10;
      gameScene.addChild(bullet);
      let instance = new Audio("/audio/shot.mp3");
      instance.volume = 0.1;
      instance.play();
      break;
    }
  }
}
