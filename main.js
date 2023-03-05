/*
Author: Reginald McPherson
Student ID: 0136897
Course: DGL-209 Capstone Project
Modified: 2023-04-03
*/

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
import TitleScreen from './titlescreen.js';
import { TitleScreenState, PlayState, GameOverState } from './stateMachine.js';

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

let titleScreen,
    gameScene,
    gameOver,
    farmer,
    id,
    scoreboard,
    heartsContainer,
    music;

let bullets = [];
let enemies = [];
let bulletLimit =10;
let enemyCount = 5;
let enemySpeed = 5;
let bgBackground;
let bgX = 0;
let bgY = 0;
let currentState = null;

// *Loader
loader.onProgress.add(loadProgressHandler);
loader
  .add('images/mvp-spritesheet.json')
  .add('gameMusic', '/audio/music/InHeavyMetal.mp3')
  .add('shot', '/audio/shot.mp3')
  .load(setup);


// ! SETUP FUNCTION (run once)
export function setup() {



  // *Create the game scene
  gameScene = new Container();
  gameScene.visible = false;

  music = new Audio('/audio/music/InHeavyMetal.mp3');




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
  gameOver = new GameOver(app);


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
  spawnEnemies(5, 10000, enemyCount, enemySpeed, gameScene, enemies, id, app);

  // *Create the scoreboard
  scoreboard = new Scoreboard();
  gameScene.addChild(scoreboard.scoreboard);
  gameScene.setChildIndex(scoreboard.scoreboard, gameScene.children.length - 1);

  // *Create Titlescreen
  titleScreen = new TitleScreen(app, startGame);
  app.stage.addChild(titleScreen.titleScene);
  currentState = TitleScreenState;

  app.stage.addChild(gameScene);


  // *Start game loop
  app.ticker.add(delta => gameLoop(delta));
}


// ! GAME LOOP (run 60fps)
function gameLoop(delta) {

  if (currentState === PlayState) {
    // Call play function
    play(delta);
  }

  // Check state and hearts, if 0, end game
  if ((currentState != end) && (heartsContainer.children.length == 0)) { currentState = end } 

  if (currentState === end && !gameOver.gameOverScene.parent) { // Check if game is over
    app.stage.addChild(gameOver.gameOverScene);
  }
}


// ! PLAY FUNCTION (run 60fps)
function play(delta) {

  if (!music.isPlaying) {
    music.play();
  }

  // Farmer movement since last frame
  const farmerDeltaX = farmer.vx * delta;
  const farmerDeltaY = farmer.vy * delta;

  // Moves the bg with the farmer
  updateBG(farmerDeltaX, farmerDeltaY);
  // Prevent offscreen movement when titleScreen is open

  moveEnemies(enemies, farmer, farmerDeltaX, farmerDeltaY, enemySpeed, heartsContainer, gameScene);
  moveBullets(bullets, enemies, scoreboard, gameScene, width, height, farmerDeltaX, farmerDeltaY);
  
}

function updateBG(farmerX, farmerY) {
  bgX -= farmerX;
  bgY -= farmerY;
  bgBackground.tilePosition.x = bgX;
  bgBackground.tilePosition.y = bgY;
}


function end() {
  scoreboard.resetScore();
  if(currentState === end && !gameOver.gameOverScene.parent) {
    app.stage.addChild(gameOver.gameOverScene);
  }
}

//!States--------------------------------------------------------------
function startGame() {
  stateTransition(PlayState);
}

function stateTransition(nextState) {
  console.log(`Moving from ${currentState.name} to ${nextState.name}`);
  currentState = nextState;
  titleScreen.titleScene.visible = currentState === TitleScreenState;
  gameScene.visible = currentState === PlayState;
  gameOver.gameOverScene.visible = currentState === GameOverState;
}



