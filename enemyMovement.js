import { hitTestRectangle } from './collisions.js';
import Victor from 'victor';

export function moveEnemies(enemies, farmer, farmerDeltaX, farmerDeltaY, enemySpeed, heartsContainer, gameScene) {
  for (let i = 0; i < enemies.length; i++) {
    let enemy = enemies[i];
    let e = new Victor(enemy.x, enemy.y);
    let f = new Victor(farmer.x, farmer.y);
    let d = f.subtract(e);
    let v = d.normalize().multiplyScalar(enemySpeed);
    enemy.position.set(enemy.position.x + v.x - farmerDeltaX, enemy.position.y + v.y - farmerDeltaY);

    if (hitTestRectangle(farmer, enemy)) {
      gameScene.removeChild(enemy);
      enemies.splice(i, 1);
      heartsContainer.removeChildAt(heartsContainer.children.length - 1);
      break;
    }
  }
}
