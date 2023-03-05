import { createEnemy } from './enemy.js';

export function spawnEnemies(numWaves, waveDelay, enemiesPerWave, speed, gameScene, enemies, id) {
  const enemySpacing = 100; // the space between each enemy
  const enemyStartY = -50; // the y position of the first enemy

  let enemyCount = 0;
  for (let wave = 0; wave < numWaves; wave++) {
    setTimeout(() => {
      for (let i = 0; i < enemiesPerWave; i++) {
        let enemy = createEnemy(id);
        enemy.x = (enemyCount + 0.5) * enemySpacing; // center each enemy horizontally
        enemy.y = enemyStartY;
        enemy.vy = speed;
        gameScene.addChild(enemy);
        enemies.push(enemy);
        enemyCount++;
      }
    }, wave * waveDelay);
  }
}
