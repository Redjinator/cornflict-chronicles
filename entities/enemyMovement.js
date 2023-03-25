import { hitTestRectangle } from '../helpers/collisions.js';
import Victor from 'victor';
import * as PIXI from 'pixi.js';

export function moveEnemies(enemies, farmer, farmerDelta, heartsContainer, gameScene) {

  const redFlash = new PIXI.Graphics();
  redFlash.beginFill(0xFF0000);
  redFlash.drawRect(0, 0, 1280, 720);
  redFlash.endFill();
  redFlash.alpha = 0.0;
  gameScene.addChild(redFlash);


  for (let i = 0; i < enemies.length; i++) {
    let enemy = enemies[i];
    let e = new Victor(enemy.x, enemy.y);
    let f = new Victor(farmer.x, farmer.y);
    let d = f.subtract(e);
    let v = d.normalize().multiplyScalar(enemy.speed);
    enemy.position.set(enemy.position.x + v.x - farmerDelta.x, enemy.position.y + v.y - farmerDelta.y);

    const playerPos = {x: farmer.x, y: farmer.y};
    const enemyPos = {x: enemy.x, y: enemy.y};

    // Calculate the angle between the player and the enemy
    const dx = playerPos.x - enemyPos.x;
    const dy = playerPos.y - enemyPos.y;
    const angle = Math.atan2(dy, dx);

    // Rotate the enemy towrds the player
    enemy.rotation = angle + Math.PI * 1.5;

    if (hitTestRectangle(farmer, enemy)) {
      playOuchSounds(redFlash)
      gameScene.removeChild(enemy);
      enemies.splice(i, 1);
      heartsContainer.removeChildAt(heartsContainer.children.length - 1);
      break;
    }
  }

  function playOuchSounds(flash) {
    let ouch1 = new Audio('audio/ouch-1a.mp3');
    let ouch2 = new Audio('audio/ouch-2a.mp3');

    if(Math.random() > 0.5) {
      ouch1.play();
      console.log('ouch1');
    } else {
      ouch2.play();
      console.log('ouch2');
    }

    redFlash.alpha = 0.5;
    gameScene.addChild(flash);
    setTimeout(() => {
      gameScene.removeChild(flash);
      redFlash.alpha = 0.0;
    }, 200);
  }
}
