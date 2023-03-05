/*
Author: Reginald McPherson
Student ID: 0136897
Course: DGL-209 Capstone Project
Modified: 2023-02-20
*/


import MainMenu from './mainmenu.js';
import Scoreboard from './scoreboard.js';
import GameOver from './gameover.js';
import { Container } from 'pixi.js';
import { createHearts } from './hearts.js';
import { loadProgressHandler } from './loadProgress.js';
import { createBackground } from './createBackground.js';
import { createPlayer } from './player.js';
import { createEnemy } from './enemy.js';
import { moveEnemies } from './enemyMovement.js';
import { createBullet } from './bullet.js';
import { moveBullets } from './bulletMovement.js';
import { shoot } from './shoot.js';


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

// *Get canvas width and height
document.body.appendChild(app.view);
const { width, height } = app.view;


// *Variables
let mainMenu,
    gameScene,
    gameOver,
    farmer,
    id,
    state,
    scoreboard,
    heartsContainer;


let bullets = [];
let enemies = [];
let bulletLimit =10;
let enemyCount = 5;
let enemySpeed = 1;
let bgBackground;
let bgX = 0;
let bgY = 0;


// *Loader
loader.onProgress.add(loadProgressHandler);

loader
  .add('images/mvp-spritesheet.json')
  .add('/audio/shot.mp3')
  .load(setup);


// ! SETUP FUNCTION ---
export function setup() {

  state = menu;

  // *Create the game scene
  gameScene = new Container();

  // *Create the scoreboard
  scoreboard = new Scoreboard();
  gameScene.addChild(scoreboard.scoreboard);

  // *Alias called id for all the texture atlas frame id textures
  id = resources["images/mvp-spritesheet.json"].textures;

  app.stage.interactive = true;

  // *Create the farmer
  farmer  = createPlayer(id);

  // *Create the hearts container
  heartsContainer = createHearts(app);


  // *Create the background
  const bgTexture = PIXI.Texture.from('images/ground02.jpg');
  bgBackground = createBackground(bgTexture, app);


  // *Scene management
  mainMenu = new MainMenu({app, gameScene});
  gameOver = new GameOver(app, farmer, heartsContainer, bullets, enemies, enemyCount, enemySpeed, scoreboard, bulletLimit, id);

  app.stage.addChild(mainMenu.menuScene);

  gameScene.addChild(farmer);
  gameScene.addChild(heartsContainer);



  // *Rotate the farmer to face the mouse
  app.stage.on('pointermove', (event) => {
    farmer.rotation = Math.atan2(event.data.global.y - farmer.y, event.data.global.x - farmer.x);
  });

  // *Creating Bullets
  for (let i=0; i<bulletLimit; i++) {
    let bullet = createBullet(id);
    bullets.push(bullet);
  }

  // *Shooting Listener
  app.stage.on('pointerdown', (event) => {
    shoot(farmer, bullets, gameScene);
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

  updateBG(farmerDeltaX, farmerDeltaY);

  if (!mainMenu.menuScene.parent) {
    // *Enemy Respawning
    if (enemies.length < enemyCount) {
      let enemy = createEnemy(id);
      enemies.push(enemy);
      gameScene.addChild(enemy);
    }

    // *Move enemies
    moveEnemies(enemies, farmer, farmerDeltaX, farmerDeltaY, enemySpeed, heartsContainer, gameScene);
    moveBullets(bullets, enemies, scoreboard, gameScene, width, height, farmerDeltaX, farmerDeltaY);
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
