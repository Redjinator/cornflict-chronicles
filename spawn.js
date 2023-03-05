import { Enemy } from './enemy.js';

export function spawnEnemies(numWaves, waveDelay, enemiesPerWave, speed, gameScene, enemies, id, app, farmer, heartsContainer) {
  let enemyCount = 0;
  
  for (let wave = 0; wave < numWaves; wave++) {
    setTimeout(() => {
      for (let i = 0; i < enemiesPerWave; i++) {
        
        let enemy = new Enemy(id, (Math.random() * speed), farmer, heartsContainer, gameScene);
        let side = Math.floor(Math.random() * 4); // randomly choose a side (0=top, 1=right, 2=bottom, 3=left)
        let enemySpacing = Math.floor(Math.random() * (app.view.width + app.view.height)) + 50; // randomly choose a distance between 50 and the diagonal of the screen
        
        // Set the enemy's initial position based on the chosen side
        switch (side) {
          case 0: // top
            enemy.x = Math.floor(Math.random() * app.view.width);
            enemy.y = -enemySpacing;
            break;
          case 1: // right
            enemy.x = app.view.width + enemySpacing;
            enemy.y = Math.floor(Math.random() * app.view.height);
            break;
          case 2: // bottom
            enemy.x = Math.floor(Math.random() * app.view.width);
            enemy.y = app.view.height + enemySpacing;
            break;
          case 3: // left
            enemy.x = -enemySpacing;
            enemy.y = Math.floor(Math.random() * app.view.height);
            break;
        }

        console.log(`Enemy ${i+1} spawned at x:${Math.ceil(enemy.x)} y:${Math.ceil(enemy.y)} with velocity vx:${Math.ceil(enemy.vx)} vy:${Math.ceil(enemy.vy)}`);

        gameScene.addChild(enemy);
        enemies.push(enemy);
        enemyCount++;
      }
    }, wave * waveDelay);
  }
}
