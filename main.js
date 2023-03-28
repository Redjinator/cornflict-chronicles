/*
Author: Reginald McPherson
Student ID: 0136897
Course: DGL-209 Capstone Project
Modified: 2023-03-015
*/

import { config } from './config.js';
import Scoreboard from './scenes/scoreboard.js';
import TitleScreen from './scenes/titlescreen.js';
import GameOver from './scenes/gameover.js';
import { Container } from 'pixi.js';
import { createHearts } from './entities/hearts.js';
import { loadProgressHandler } from './helpers/loadProgress.js';
import { createBackground } from './helpers/createBackground.js';
import { createPlayer } from './entities/player.js';
import { moveEnemies } from './entities/enemyMovement.js';
import { createAutoFireForks, createBullet } from './entities/bullet.js';
import { moveBullets } from './entities/bulletMovement.js';
import { shoot } from './entities/shoot.js';
import { spawnEnemies } from './entities/spawn.js';
import { TitleScreenState, PlayState, GameOverState } from './helpers/stateMachine.js';
import { Timer } from './helpers/timer.js';
import { rotateTowards } from './helpers/rotateTowards.js';
import { autoFire } from './helpers/autoFire.js';
import { Sprite } from 'pixi.js';


const Application = PIXI.Application,
      loader      = PIXI.Loader.shared,
      resources   = PIXI.Loader.shared.resources;

const app = new Application({
  width: 1280,
  height: 720,
  view: document.getElementById('game-canvas'),
  //context: create2DContextWithWillReadFrequently(1280, 720),
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
    ground,
    idObjects,
    idScreens,
    scoreboard,
    heartsContainer,
    music,
    timer,
    timerText,
    bgBackground,
    dayNightOverlay;

let bullets;
let enemies;
let forks;
let currentState = TitleScreenState;


// Loader
loader.onProgress.add(loadProgressHandler);
loader
  .add('images/screens-spritesheet.json')
  .add('images/obj-spritesheet.json')
  .add('images/ground.jpg')
  .load(setup);


// * CREATE GAME OBJECTS====
function createGameObjects() {

  // Load sprite sheets
  idScreens = resources["images/screens-spritesheet.json"].textures;
  idObjects = resources["images/obj-spritesheet.json"].textures;
  ground = resources["images/ground.jpg"].texture;

  // Game scenes
  gameScene = new Container();
  gameScene.visible = false;

  // Create farmer
  farmer = createPlayer(idObjects);
  gameScene.addChild(farmer);

  // Create hearts container
  heartsContainer = createHearts(app);
  heartsContainer.position.set(10, 10);
  gameScene.addChild(heartsContainer);

  // Create the scoreboard
  scoreboard = new Scoreboard();
  gameScene.addChild(scoreboard.scoreboard);

  // Create background
  bgBackground = createBackground(new Sprite(ground).texture, app);

  // Create day/night overlay
  createDayNightOverlay();

  // Gameplay Music
  music = new Audio('/audio/music/InHeavyMetal.mp3');

  // Create Titlescreen
  titleScreen = new TitleScreen(app, startGame, idScreens);

  // Create game over screen
  gameOver = new GameOver(app, scoreboard, setup, idScreens);

  // Timer
  createTimerText();
  timer = new Timer(timerText, endGame, (currentTime) => {
    const maxAlpha = 1; // Max darkness 0 - 1
    const alphaIncrement = maxAlpha / timer.startTime;
    dayNightOverlay.alpha = maxAlpha - (alphaIncrement * currentTime);
  });

  forks.forEach((fork) => gameScene.addChild(fork));
} // ! CREATE GAME OBJECTS END


// * INITIALIZE VARIABLES START
function initializeVariables() {
  bullets = [];
  enemies = [];
  forks = [];
} // ! INITIALIZE VARIABLES END

// * ==========================================================================


// * SETUP START
export function setup() {

  // Initialize variables and game objects
  initializeVariables();
  createGameObjects();

  // Setup event listeners
  setupEventListeners();

  // Creating Bullets
  createBullets(100, idObjects);

  // Auto-firing weapon (prototype power up)
  autoFire(farmer, forks, gameScene, true, 500);

  // Spawn enemies with specifics for each wave
  spawnEnemies(
    config.numWaves,
    config.waveDelaySec,
    config.enemyCount,
    config.enemySpeed,
    gameScene, enemies,
    idObjects,
    app,
    farmer);

  // Add title and game screen to stage
  app.stage.addChild(titleScreen.titleScene);
  app.stage.addChild(gameScene);

  // Start game loop
  app.ticker.add(delta => gameLoop(delta));
  
}
// ! SETUP END



// * GAME LOOP START
function gameLoop(delta) {
  if (currentState === PlayState) { play(delta) }

  // Check for 0 hearts (game over)
  if (currentState == PlayState && heartsContainer.children.length == 0) {
    endGame();

    playGameOverMusic();
  }
} // ! GAME LOOP END



// * PLAY START
function play(delta) {

  // Play music
  playMusic();

  // Farmer movement since last frame, use to calculate movement of enemies and bullets with infinite scroll bg
  const farmerDelta = (delta) = {
    x: farmer.vx * delta,
    y: farmer.vy * delta
  }

  // Moves the bg with the farmer
  updateBG(farmerDelta);

  // Movement of Enemies and bullets, and collision detection
  moveEnemies(enemies, farmer, farmerDelta, heartsContainer, gameScene);
  moveBullets(bullets, enemies, scoreboard, gameScene, width, height, farmerDelta, farmer);

  // Check score for win
  scoreboard.score >= config.scoreToWin ? endGame() : null;
} // ! PLAY END






// * END GAME START
function endGame() {
  gameOver = new GameOver(app, scoreboard.score, startGame, idScreens);
  app.stage.addChild(gameOver.gameOverScene);
  app.stage.removeChild(gameScene);

  // Stop music
  music.pause();

  // Reset score
  scoreboard.resetScore();
  stateTransition(GameOverState);

  // Remove all enemies
  enemies.forEach(enemy => gameScene.removeChild(enemy));

  // Remove all bullets
  bullets.forEach(bullet => gameScene.removeChild(bullet));

  // Remove farmer from view
  farmer.visible = false;

  // gameover screen
  gameOver.gameOverScene.visible = true;
} // ! END GAME END



// * START GAME START
function startGame() {

  // Hide title screen
  titleScreen.titleScene.visible = false;

  // Hide game over screen
  gameOver.gameOverScene.visible = false;

  // Start a new game
  if(currentState === GameOverState) {
    setup()
  }

  // Switch to play state
  stateTransition(PlayState);

  // Start the timer
  timer.start();
 } // ! START GAME END



// * STATE TRANSITION START
function stateTransition(nextState = TitleScreenState) {
  currentState = nextState;
  titleScreen.titleScene.visible = currentState === TitleScreenState;
  gameScene.visible = currentState === PlayState;
  gameOver.gameOverScene.visible = currentState === GameOverState;
} // ! STATE TRANSITION END


// *HELPER FUNCTIONS
//*=========================================================
function createTimerText() {
  timerText = new PIXI.Text('Time: 30', {
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
  timerText.position.set(width - 200, height - 700);
  gameScene.addChild(timerText);
}

// * Event Listeners
function setupEventListeners() {
  app.stage.interactive = true;

  app.stage.on('pointermove', (event) => {
    farmer.rotation = rotateTowards(event, farmer);
  });

  app.stage.on('pointerdown', (event) => {
    shoot(farmer, bullets, gameScene);
  });
} // ! Event Listeners

function createBullets(bulletLimit, id) {
  for (let i = 0; i < bulletLimit; i++) {
    let bullet = createBullet(id);
    bullets.push(bullet);
  }
}

function playGameOverMusic() {
  music.pause();

  let gameOverMusic = new Audio('/audio/game-over.mp3');
  gameOverMusic.loop = false;
  gameOverMusic.play();
}

function playMusic() {
  if(!music.isPlaying) {
    music.play();
  }
}

// Move tiling background based on farmer movement input
function updateBG(farmerDelta) {
  bgBackground.tilePosition.x -= farmerDelta.x;
  bgBackground.tilePosition.y -= farmerDelta.y;
}

function createDayNightOverlay() {
  dayNightOverlay = new PIXI.Graphics();
  dayNightOverlay.beginFill(0x000000);
  dayNightOverlay.drawRect(0, 0, width, height);
  dayNightOverlay.endFill();
  dayNightOverlay.alpha = 0;
  gameScene.addChild(dayNightOverlay);
}