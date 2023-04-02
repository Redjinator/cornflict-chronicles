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
  farmer,
  timer,
  gameStarted,
) {
  const spawnInterval = (waveDelaySec * 10000) / enemiesPerWave;
    if(gameStarted) {
      console.log("spawning enemies");
      for (let wave = 0; wave < numWaves; wave++) {
        let waveEnemies = 0;

        const spawnEnemy = setInterval(() => {
          if (waveEnemies >= enemiesPerWave) {
            clearInterval(spawnEnemy);
            return;
          }

          const enemyType = getEnemyTypeByTimerPercentage(timer);
          const enemy = new Enemy(id, enemyType);
          const side = Math.floor(Math.random() * 4); // randomly choose a side (0=top, 1=right, 2=bottom, 3=left)
          const enemySpacing = Math.floor(Math.random() * (app.view.width + app.view.height)) + 500;
          enemy.speed = enemy.name == "ecorn_bluesm" ? 1 : speed;
          enemy.speed = enemy.name == "ecorn_limesm" ? 2 : speed;
          enemy.speed = enemy.name == "ecorn_yellow" ? 3 : speed;
          enemy.speed = enemy.name == "ecorn_redsm"  ? 4 : speed;

          setPositionBySide(enemy, side, enemySpacing, farmer, app);

          gameScene.addChild(enemy);
          enemies.push(enemy);
          waveEnemies++;
        }, spawnInterval);
      }
    } else {
      return;
    }
}

function getEnemyTypeByTimerPercentage(timer) {
  const percentage = (timer.currentTime / timer.startTime) * 100;

  if (percentage > 75) return 3;
  if (percentage > 50) return 2;
  if (percentage > 25) return 1;
  return 0;
}

function setPositionBySide(enemy, side, enemySpacing, farmer, app) {
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
}
