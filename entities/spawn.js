import { Enemy } from "./enemy.js";

export function spawnEnemies(
  numWaves,
  waveDelaySec,
  enemiesPerWave,
  speed,
  gameScene,
  enemies,
  id,
  app,
  farmer
) {
  let enemyCount = 0;

  for (let wave = 0; wave < numWaves; wave++) {
    let waveEnemies = 0;
    let spawnInterval = (waveDelaySec * 10000) / enemiesPerWave;

    let spawnEnemy = setInterval(() => {
      if (waveEnemies >= enemiesPerWave) {
        clearInterval(spawnEnemy);
      } else {
        let enemy = new Enemy(id, speed, gameScene);
        let side = Math.floor(Math.random() * 4); // randomly choose a side (0=top, 1=right, 2=bottom, 3=left)
        let enemySpacing =
          Math.floor(Math.random() * (app.view.width + app.view.height)) + 500; 

        // Set the enemy's initial position based on the chosen side
        switch (side) {
          case 0: // top
            enemy.x = Math.floor(Math.random() * app.view.width);
            enemy.y = farmer.y - enemySpacing;
            break;
          case 1: // right
            enemy.x = farmer.x + enemySpacing;
            enemy.y = Math.floor(Math.random() * app.view.height);
            break;
          case 2: // bottom
            enemy.x = Math.floor(Math.random() * app.view.width);
            enemy.y = farmer.y + enemySpacing;
            break;
          case 3: // left
            enemy.x = farmer.x - enemySpacing;
            enemy.y = Math.floor(Math.random() * app.view.height);
            break;
        }

        gameScene.addChild(enemy);
        enemies.push(enemy);
        enemyCount++;
        waveEnemies++;
      }
    }, spawnInterval);
  }
}
