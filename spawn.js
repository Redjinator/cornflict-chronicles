import { createEnemy } from './enemy.js';

export function spawnEnemies(count, speed, gameScene, enemies, id) {
  const enemySpacing = 100; // the space between each enemy
  const enemyStartY = -50; // the y position of the first enemy

  for (let i = 0; i < count; i++) {
    let enemy = createEnemy(id);
    enemy.x = (i + 0.5) * enemySpacing; // center each enemy horizontally
    enemy.y = enemyStartY;
    enemy.vy = speed;
    gameScene.addChild(enemy);
    enemies.push(enemy);
  }
}
