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

    // Rotate the enemy towards the player
    enemy.rotation = angle + Math.PI * 1.5;

    if (hitTestRectangle(farmer, enemy)) {
      playOuchSounds(redFlash);
      farmer.setAnimation('hurt');
      gameScene.removeChild(enemy);
      enemies.splice(i, 1);
      if (heartsContainer.children.length > 0) {
        heartsContainer.removeChildAt(heartsContainer.children.length - 1);
      } else {
        console.log('game over');
        break;
      }
    }
  }

  function playOuchSounds(flash) {
    let ouch1 = new Audio('audio/ouch-1a.mp3');
    let ouch2 = new Audio('audio/ouch-2a.mp3');
    let ouch3 = new Audio('audio/ouch-3a.mp3');

    if(Math.random() < 0.4) {
      ouch1.play();
    } else if (Math.random() < 0.8) {
      ouch2.play();
    } else {
      ouch3.play();
    }

    redFlash.alpha = 0.5;
    gameScene.addChild(flash);
    setTimeout(() => {
      gameScene.removeChild(flash);
      redFlash.alpha = 0.0;
    }, 200);
  }
}
