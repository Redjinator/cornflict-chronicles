/*
Author: Reginald McPherson
Student ID: 0136897
Course: DGL-209 Capstone Project
Modified: 2023-04-03
*/

import MainMenu from './mainmenu.js';
import Scoreboard from './scoreboard.js';
import GameOver from './gameover.js';
import { Container } from 'pixi.js';
import { createHearts } from './hearts.js';
import { loadProgressHandler } from './loadProgress.js';
import { createBackground } from './createBackground.js';
import { createPlayer } from './player.js';
import { moveEnemies } from './enemyMovement.js';
import { createBullet } from './bullet.js';
import { moveBullets } from './bulletMovement.js';
import { shoot } from './shoot.js';
import { spawnEnemies } from './spawn.js';

const Application = PIXI.Application,
  loader = PIXI.Loader.shared,
  resources = PIXI.Loader.shared.resources;

const app = new Application({
  width: 1280,
  height: 720,
  antialias: true,
  transparent: false,
  resolution: 1
});

document.body.appendChild(app.view);
const { width, height } = app.view;

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


// ! SETUP FUNCTION (run once)
export function setup() {

  state = menu;

  // *Create the game scene
  gameScene = new Container();

  // *Create the scoreboard
  scoreboard = new Scoreboard();
  gameScene.addChild(scoreboard.scoreboard);

  // *Alias for texture atlas frame id textures
  id = resources["images/mvp-spritesheet.json"].textures;

  app.stage.interactive = true;

  // *Create the farmer
  farmer  = createPlayer(id);
  gameScene.addChild(farmer);

  // *Create the hearts container
  heartsContainer = createHearts(app);
  gameScene.addChild(heartsContainer);

  // *Create the background
  const bgTexture = PIXI.Texture.from('images/ground02.jpg');
  bgBackground = createBackground(bgTexture, app);

  // *Scene management
  mainMenu = new MainMenu({app, gameScene});
  gameOver = new GameOver(app);

  app.stage.addChild(mainMenu.menuScene);


  // *Rotate farmer to face mouse
  app.stage.on('pointermove', (event) => {
    farmer.rotation = Math.atan2(event.data.global.y - farmer.y, event.data.global.x - farmer.x);
  });

  // *Creating Bullets (Move to shoot function?)
  for (let i=0; i<bulletLimit; i++) {
    let bullet = createBullet(id);
    bullets.push(bullet);
  }

  // *Shooting Listener
  app.stage.on('pointerdown', (event) => {
    shoot(farmer, bullets, gameScene);
  });

  // *Spawn enemies, 5 waves, 10 seconds between waves, 5 enemies per wave, 1 speed, gameScene, enemies, id
  spawnEnemies(5, 10000, enemyCount, enemySpeed, gameScene, enemies, id);

  // *Start game loop
  state = play;
  app.ticker.add(delta => gameLoop(delta));
}


// ! GAME LOOP (run 60fps)
function gameLoop(delta) {

  // Run current state
  state(delta);

  // Check state and hearts, if 0, end game
  if ((state != end) && (heartsContainer.children.length == 0)) { state = end } 

  if (state === end && !gameOver.gameOverScene.parent) { // Check if game is over
    app.stage.addChild(gameOver.gameOverScene);
  }
}


// ! PLAY FUNCTION (run 60fps)
function play(delta) {

  // Farmer movement since last frame
  const farmerDeltaX = farmer.vx * delta;
  const farmerDeltaY = farmer.vy * delta;

  // Moves the bg with the farmer
  updateBG(farmerDeltaX, farmerDeltaY);

  if (!mainMenu.menuScene.parent) { // Prevent offscreen movement when menu is open
    moveEnemies(enemies, farmer, farmerDeltaX, farmerDeltaY, enemySpeed, heartsContainer, gameScene);
    moveBullets(bullets, enemies, scoreboard, gameScene, width, height, farmerDeltaX, farmerDeltaY);
  }
}

// ! END FUNCTION
function end() { scoreboard.resetScore() }

// ! MENU FUNCTION
function menu() {}

// ! UPDATE BACKGROUND FUNCTION
function updateBG(farmerX, farmerY) {
  bgX -= farmerX;
  bgY -= farmerY;
  bgBackground.tilePosition.x = bgX;
  bgBackground.tilePosition.y = bgY;
}