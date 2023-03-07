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
import { Timer } from './timer.js';


const Application = PIXI.Application,
      loader      = PIXI.Loader.shared,
      resources   = PIXI.Loader.shared.resources;

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
let scoreToWin = 50;
let bulletLimit =10;
let numWaves = 10;
let waveDelaySec = 10;
let enemyCount = 50;
let enemySpeed = 6;
let bgBackground;
let bgX = 0;
let bgY = 0;
let currentState = null
let timer;
let timerText;



// *Loader
loader.onProgress.add(loadProgressHandler);
loader
  .add('images/mvp-spritesheet.json')
  .add('ecorn.png')
  .add('gameMusic', '/audio/music/InHeavyMetal.mp3')
  .add('shot', '/audio/shot.mp3')
  .load(setup);


// ! SETUP FUNCTION (run once)
export function setup() {

  // Create the game scene
  gameScene = new Container();
  gameScene.visible = false;

  // Attempt to fix the issue with the game scene running at double speed after restarting.
  clearGameScene();

  // Gameplay music baby
  music = new Audio('/audio/music/InHeavyMetal.mp3');

  // Timer text
  timerText = new PIXI.Text('Time: 0', {
    fontFamily: 'Arial',
    fontSize: 36,
    fill: "white",
    stroke: 'orange',
    strokeThickness: 4,
    dropShadow: true,
    dropShadowColor: "#000000",
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    wordWrap: true,
    wordWrapWidth: 440
  });




  // timer text position
  timerText.position.set(width - 680, height - 550);

  // add the timer text to the gameScene
  gameScene.addChild(timerText);

  // create the timer with the timer text
  timer = new Timer(timerText, endGame);

  // Alias for texture atlas frame id textures
  id = resources["images/mvp-spritesheet.json"].textures;

  app.stage.interactive = true;

  // Create the farmer
  farmer  = createPlayer(id);
  gameScene.addChild(farmer);

  // Create the hearts container
  heartsContainer = createHearts(app);
  gameScene.addChild(heartsContainer);

  // Create the background
  const bgTexture = PIXI.Texture.from('images/ground01.jpg');
  bgBackground = createBackground(bgTexture, app);

  // Scene management
  gameOver = new GameOver(app);

  app.stage.on('pointermove', (event) => {// Rotate farmer to face mouse
    farmer.rotation = Math.atan2(event.data.global.y - farmer.y, event.data.global.x - farmer.x);
  });

  for (let i=0; i<bulletLimit; i++) { // Creating Bullets (Move to shoot function?)
    let bullet = createBullet(id);
    bullets.push(bullet);
  }

  app.stage.on('pointerdown', (event) => {// Shooting Listener
    shoot(farmer, bullets, gameScene);
  });

  // Spawn enemies with specifics for each wave
  spawnEnemies(numWaves, waveDelaySec, enemyCount, enemySpeed, gameScene, enemies, id, app, farmer);





  // Create the scoreboard
  scoreboard = new Scoreboard();
  gameScene.addChild(scoreboard.scoreboard);
  gameScene.setChildIndex(scoreboard.scoreboard, gameScene.children.length - 1);

  // Create Titlescreen
  titleScreen = new TitleScreen(app, startGame, id);
  app.stage.addChild(titleScreen.titleScene);
  currentState = TitleScreenState;
  app.stage.addChild(gameScene);


  // *Start game loop
  app.ticker.add(delta => gameLoop(delta));
}


// ! GAME LOOP (run 60fps)
function gameLoop(delta) {
  if (currentState === PlayState) {// Update the current game state
    play(delta);
  }

  if (currentState !== GameOverState && heartsContainer.children.length == 0) {// Check hearts for game over
    endGame();
    music.pause();
    let gameOverMusic = new Audio('/audio/game-over.mp3');
    gameOverMusic.loop = false;
    gameOverMusic.play();
  }
}


// ! PLAY FUNCTION (run 60fps)
function play(delta) {

  // Play music
  if (!music.isPlaying) {
    music.play();
  }



  // Farmer movement since last frame
  const farmerDeltaX = farmer.vx * delta;
  const farmerDeltaY = farmer.vy * delta;

  // Moves the bg with the farmer
  updateBG(farmerDeltaX, farmerDeltaY);

  // Movement of Enemies and bullets, and collision detection
  moveEnemies(enemies, farmer, farmerDeltaX, farmerDeltaY, heartsContainer, gameScene);
  moveBullets(bullets, enemies, scoreboard, gameScene, width, height, farmerDeltaX, farmerDeltaY);

  // Check score for win
  if ((currentState !== GameOverState) && (scoreboard.score >= scoreToWin)) {

    // End game
    endGame();
    
  }
}

function updateBG(farmerX, farmerY) {
  bgX -= farmerX;
  bgY -= farmerY;
  bgBackground.tilePosition.x = bgX;
  bgBackground.tilePosition.y = bgY;
}

function endGame() {
  gameOver = new GameOver(app, scoreboard.score, startGame);
  app.stage.addChild(gameOver.gameOverScene);
  music.pause();

  scoreboard.resetScore();
  stateTransition(GameOverState);

  farmer.visible = false;
  gameOver.gameOverScene.visible = true;
}

//!States--------------------------------------------------------------
function startGame() {

  gameOver.gameOverScene.visible = false;
  if(currentState === GameOverState) {
    setup();
  }
  stateTransition(PlayState);
}

function stateTransition(nextState) {
  console.log(`Moving from ${currentState.name} to ${nextState.name}`);
  nextState === PlayState ? timer.start() : timer.stop();
  currentState = nextState;
  titleScreen.titleScene.visible = currentState === TitleScreenState;
  gameScene.visible = currentState === PlayState;
  gameOver.gameOverScene.visible = currentState === GameOverState;
}


function clearGameScene() {
  gameScene.removeChildren();
  bullets = [];
  enemies = [];
}
