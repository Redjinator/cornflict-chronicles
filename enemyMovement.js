import { hitTestRectangle } from './collisions.js';
import Victor from 'victor';
import { rotateTowards } from './functions/rotateTowards.js';

export function moveEnemies(enemies, farmer, farmerDeltaX, farmerDeltaY, heartsContainer, gameScene) {

  

  for (let i = 0; i < enemies.length; i++) {
    let enemy = enemies[i];
    let e = new Victor(enemy.x, enemy.y);
    let f = new Victor(farmer.x, farmer.y);
    let d = f.subtract(e);
    let v = d.normalize().multiplyScalar(enemy.speed);
    enemy.position.set(enemy.position.x + v.x - farmerDeltaX, enemy.position.y + v.y - farmerDeltaY);

    const playerPos = {x: farmer.x, y: farmer.y};
    const enemyPos = {x: enemy.x, y: enemy.y};

    // Calculate the angle between the player and the enemy
    const dx = playerPos.x - enemyPos.x;
    const dy = playerPos.y - enemyPos.y;
    const angle = Math.atan2(dy, dx);

    // Rotate the enemy towrds the player
    enemy.rotation = angle + Math.PI * 1.5;

    if (hitTestRectangle(farmer, enemy)) {
      playOuchSounds()
      gameScene.removeChild(enemy);
      enemies.splice(i, 1);
      heartsContainer.removeChildAt(heartsContainer.children.length - 1);
      break;
    }
  }

  function playOuchSounds() {
    let ouch1 = new Audio('audio/ouch-1a.mp3');
    let ouch2 = new Audio('audio/ouch-2a.mp3');
    if(Math.random() > 0.5) {
      ouch1.play();
      console.log('ouch1');
    } else {
      ouch2.play();
      console.log('ouch2');
    }
  }
}
