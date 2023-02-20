/*
Author: Reginald McPherson
Student ID: 0136897
Course: DGL-209 Capstone Project
Modified: 2023-02-20

Plan
--------------------------------
Next: game over condition
Then: high score screen
Then: parallax scrolling background
Then: levels and waves
Then: game win
Then: music and sound effects
Then: replace assets with original art
*/


/* #region Imports, Aliases and Application */

import { setSpriteProperties, loadProgressHandler, randomSpawnPoint } from './myfunctions.js';
import { Container, TextStyle } from 'pixi.js';
import { hitTestRectangle } from './collisions.js';
import MainMenu from './mainmenu.js';
import Victor from 'victor';
import { setupKeyboard } from './keyboardMovement.js';
import { createHearts } from './hearts.js';
import Scoreboard from './scoreboard.js';


const Application = PIXI.Application,
  loader = PIXI.Loader.shared,
  resources = PIXI.Loader.shared.resources,
  Sprite = PIXI.Sprite


const app = new Application({
  width: 1280,
  height: 720,
  antialias: true,
  transparent: false,
  resolution: 1
});

// *Add canvas and get width and height
document.body.appendChild(app.view);
const { width, height } = app.view;


// Create variables
let gameScene, farmer, enemy, fieldbg, id, state, score, scoreboard, mouseTarget, heartsContainer;
let bullets = [];
let enemies = [];
let bulletLimit =10;
let enemyCount = 5;
let enemySpeed = 1;


// Loader
loader.onProgress.add(loadProgressHandler);

loader
  .add('images/mvp-spritesheet.json')
  .load(setup);

/* #endregion Application */









/* #region Setup */
// ! SETUP FUNCTION --------------------------------------------------------------------------
function setup() {

  // *Set score to 0
  score = 0;

  // *Create the game scene
  gameScene = new Container();


  // *Alias called id for all the texture atlas frame id textures
  id = resources["images/mvp-spritesheet.json"].textures;


  // TODO: This function is kind of confusing, not sure if I should keep it or not.
  // *Create the sprites with the setSpriteProperties function (sprite, anchor, scale, positionX, positionY) cx and cy are set to 0 internally by default.
  fieldbg = setSpriteProperties(new Sprite(id["field-bg.png"]), 1, 1, 1280, 720);


  // *Create the farmer
  farmer  = setSpriteProperties(new Sprite(id["farmer-v3.png"]), 0.5, 0.2, 640, 600);
  farmer = setupKeyboard(farmer);
  heartsContainer = createHearts(app);

  // *Scene management
  const mainMenu = new MainMenu({app, gameScene});
  app.stage.addChild(mainMenu.menuScene);
  gameScene.addChild(fieldbg);
  gameScene.addChild(farmer);
  gameScene.addChild(heartsContainer);

  // *Create the scoreboard
  scoreboard = new Scoreboard();
  gameScene.addChild(scoreboard.scoreboard);

  // *Rotate the farmer to face the mouse
  app.stage.on('pointermove', (event) => {
    farmer.rotation = Math.atan2(event.data.global.y - farmer.y, event.data.global.x - farmer.x);
  });




  // *Creating Bullets
  for (let i=0; i<bulletLimit; i++) {
    let bullet = new Sprite(id["bullet.png"]);
    bullets.push(bullet);
  }

  app.stage.on('pointerdown', (event) => {
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
            instance.play();
            break;
        }
    }
  });

  app.stage.interactive = true;
  state = play;
  app.ticker.add(delta => gameLoop(delta));

}
/* #endregion */

// ===================== END OF SETUP =====================




/* #region Function gameLoop */
// ! GAME LOOP
function gameLoop(delta) {

  // *Update the current game state:
  // *Because gameLoop is calling state 60 times per second, it means play function will also run 60 times per second.
  state(delta);

  // *Check if farmer is out of hearts
  if ((state != end) && (heartsContainer.children.length == 0)) {
    state = end;
  }
}
/* #endregion */

/* #region Function play*/
// ! PLAY FUNCTION
function play(delta) {

  // *Farmer movement
  farmer.x += farmer.vx;
  farmer.y += farmer.vy;

  if (enemies.length < enemyCount) {
    let enemy = new Sprite(id["enemy.png"]);
    enemies.push(enemy);
    gameScene.addChild(enemy);
    enemy.scale.set(0.5, 0.5);
    enemy.anchor.set(0.5, 0.5);
    let r = randomSpawnPoint();
    enemy.x = r.x;
    enemy.y = r.y;
  }



  // * Move enemies
  for (let i = 0; i < enemies.length; i++) {
    let enemy = enemies[i];
    let e = new Victor(enemy.x, enemy.y);
    let f = new Victor(farmer.x, farmer.y);
    let d = f.subtract(e);
    let v = d.normalize().multiplyScalar(enemySpeed);
    enemy.position.set(enemy.position.x + v.x, enemy.position.y + v.y);

      if (hitTestRectangle(farmer, enemy)) {
        gameScene.removeChild(enemy);
        enemies.splice(i, 1);
        heartsContainer.removeChildAt(heartsContainer.children.length - 1);
        break;
      }
  }

  // * Bullet movement and collision
  for (let i = 0; i < bullets.length; i++) {
    let bullet = bullets[i];
    if (bullet.parent) {
      bullet.x += bullet.vx;
      bullet.y += bullet.vy;

      for (let j = 0; j < enemies.length; j++) {
        let enemy = enemies[j];
        if (hitTestRectangle(bullet, enemy)) {
          scoreboard.increaseScore();
          gameScene.removeChild(bullet);
          gameScene.removeChild(enemy);
          enemies.splice(j, 1);
          break;
        }
      }

      if (bullet.x < 0 || bullet.x > width || bullet.y < 0 || bullet.y > height) {
        gameScene.removeChild(bullet);
      }
    }
  }
}
//-----
/* #endregion */

/* #region Function end */
// ! END FUNCTION
function end() {
  scoreboard.resetScore();


}
/* #endregion */

