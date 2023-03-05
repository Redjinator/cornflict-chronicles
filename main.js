/*
Author: Reginald McPherson
Student ID: 0136897
Course: DGL-209 Capstone Project
Modified: 2023-02-20
*/

import { Container } from 'pixi.js';
import { hitTestRectangle } from './collisions.js';
import MainMenu from './mainmenu.js';
import Victor from 'victor';
import { setupKeyboard } from './keyboardMovement.js';
import { createHearts } from './hearts.js';
import Scoreboard from './scoreboard.js';
import GameOver from './gameover.js';
import { setSpriteProperties } from './spriteProperties.js';
import { loadProgressHandler } from './loadProgress.js';
import { randomSpawnPoint } from './spawnPoint.js';
import { createBackground } from './createBackground.js';


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


// *Variables
let gameScene,
    gameOver,
    farmer,
    id,
    state,
    scoreboard,
    heartsContainer,
    backgroundContainer;


let bullets = [];
let enemies = [];
let bulletLimit =10;
let enemyCount = 5;
let enemySpeed = 1;
let bgBackground;
let bgX = 0;
let bgY = 0;
let bgSpeed = 1;


// *Loader
loader.onProgress.add(loadProgressHandler);

loader
  .add('images/mvp-spritesheet.json')
  .load(setup);


// ! SETUP FUNCTION --------------------------------------------------------------------------
export function setup() {

  state = menu;

  // *Create the game scene
  gameScene = new Container();
  backgroundContainer = new Container();

  // *Alias called id for all the texture atlas frame id textures
  id = resources["images/mvp-spritesheet.json"].textures;

  app.stage.interactive = true;

  // *Create the farmer
  farmer  = setSpriteProperties(new Sprite(id["farmer-v3.png"]), 0.5, 0.2, 640, 360);
  farmer = setupKeyboard(farmer);
  heartsContainer = createHearts(app);


  // *Create the background
  const bgTexture = PIXI.Texture.from('images/ground02.jpg');
  bgBackground = createBackground(bgTexture, app);


  // *Scene management
  const mainMenu = new MainMenu({app, gameScene});
  gameOver = new GameOver(app);
  app.stage.addChild(mainMenu.menuScene);

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

  state = play;
  app.ticker.add(delta => gameLoop(delta));
}



// ! GAME LOOP
function gameLoop(delta) {

  // *Update game state 60x per second
  state(delta);

  // * Check state and hearts
  if ((state != end) && (heartsContainer.children.length == 0)) {
    state = end;
  }

  // * Check if game is over
  if (state === end && !gameOver.gameOverScene.parent) {
    app.stage.addChild(gameOver.gameOverScene);
  }
}



// ! PLAY FUNCTION
function play(delta) {

  // *Farmer movement since last frame
  const farmerDeltaX = farmer.vx * delta;
  const farmerDeltaY = farmer.vy * delta;

  // *Move bg
  backgroundContainer.x -= farmerDeltaX;
  backgroundContainer.y -= farmerDeltaY;

  updateBG(farmerDeltaX, farmerDeltaY);


  // *Enemy Respawning
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


  // *Move enemies
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


  // *Bullet movement
  for (let i = 0; i < bullets.length; i++) {
    let bullet = bullets[i];
    if (bullet.parent) {
      bullet.x += bullet.vx - farmerDeltaX;
      bullet.y += bullet.vy - farmerDeltaY;

      // *Check for collision with enemies
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

      // *Remove bullets out of bounds
      if (bullet.x < 0 || bullet.x > width || bullet.y < 0 || bullet.y > height) {
        gameScene.removeChild(bullet);
      }
    }
  }
}



// ! END FUNCTION
function end() {
  scoreboard.resetScore();
}



function menu() {

}

function updateBG(fx, fy) {
  bgX -= fx;
  bgY -= fy;
  bgBackground.tilePosition.x = bgX;
  bgBackground.tilePosition.y = bgY;
}