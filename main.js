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
import { createBullet } from './entities/bullet.js';
import { moveBullets } from './entities/bulletMovement.js';
import { shoot } from './entities/shoot.js';
import { spawnEnemies } from './entities/spawn.js';
import { TitleScreenState, PlayState, GameOverState } from './helpers/stateMachine.js';
import { Timer } from './helpers/timer.js';
import { rotateTowards } from './helpers/rotateTowards.js';

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
    music,
    timer,
    timerText,
    bgBackground;

let bullets;
let enemies;
let bgX;
let bgY;
let currentState;
let farmerDeltaX;
let farmerDeltaY;


// Loader
loader.onProgress.add(loadProgressHandler);
loader
  .add('images/mvp-spritesheet.json')
  .load(setup);


// ! SETUP FUNCTION (run once)
export function setup() {

  bullets = [];
  enemies = [];
  bgX = 0;
  bgY = 0;
  farmerDeltaX = 0;
  farmerDeltaY = 0;


  // Create the game scene
  gameScene = new Container();
  gameScene.visible = false;

  // Attempt to fix the issue with the game scene running at double speed after restarting.
  clearGameScene();

  // Gameplay music baby
  music = new Audio('/audio/music/InHeavyMetal.mp3');

  // Timer text
  timerText = new PIXI.Text('Time: 125', {
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
  timerText.position.set(width - 200, height - 700);
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
  heartsContainer.position.set(10, 10);
  gameScene.addChild(heartsContainer);

  // Create the background
  const bgTexture = PIXI.Texture.from('images/ground01.jpg');
  bgBackground = createBackground(bgTexture, app);

  // Create game over screen
  gameOver = new GameOver(app);

  // Rotate farmer to face mouse
  app.stage.on('pointermove', (event) => {
    farmer.rotation = rotateTowards(event, farmer);
  });

  // Creating Bullets
  for (let i=0; i<config.bulletLimit; i++) {
    let bullet = createBullet(id);
    bullets.push(bullet);
  }

  // Shooting Listener
  app.stage.on('pointerdown', (event) => {
    shoot(farmer, bullets, gameScene);
  });

  // Spawn enemies with specifics for each wave
  spawnEnemies(config.numWaves, config.waveDelaySec, config.enemyCount, config.enemySpeed, gameScene, enemies, id, app, farmer);

  // Create the scoreboard
  scoreboard = new Scoreboard();
  gameScene.addChild(scoreboard.scoreboard);

  // Create Titlescreen
  titleScreen = new TitleScreen(app, startGame, id);
  app.stage.addChild(titleScreen.titleScene);
  currentState = TitleScreenState;
  app.stage.addChild(gameScene);

  // Start game loop
  app.ticker.add(delta => gameLoop(delta));

}



// ! GAME LOOP (run 60fps)
function gameLoop(delta) {

  // Update the current game state
  if (currentState === PlayState) { play(delta) }

  // Check for 0 hearts (game over)
  if (currentState !== GameOverState && heartsContainer.children.length == 0) {

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
    music.volume = 0.0;
    music.play();
  }

  // Farmer movement since last frame
  farmerDeltaX = farmer.vx * delta;
  farmerDeltaY = farmer.vy * delta;

  // Moves the bg with the farmer
  updateBG(farmerDeltaX, farmerDeltaY);

  // Movement of Enemies and bullets, and collision detection
  moveEnemies(enemies, farmer, farmerDeltaX, farmerDeltaY, heartsContainer, gameScene);
  moveBullets(bullets, enemies, scoreboard, gameScene, width, height, farmerDeltaX, farmerDeltaY);


  // Check score for win
  if ((currentState !== GameOverState) && (scoreboard.score >= config.scoreToWin)) {

    endGame(); // End game
  }
}

// Move tiling background based on farmer movement input
function updateBG(farmerX, farmerY) {
  bgBackground.tilePosition.x -= farmerX;
  bgBackground.tilePosition.y -= farmerY;
}

// ! END GAME FUNCTION
function endGame() {
  gameOver = new GameOver(app, scoreboard.score, startGame);
  app.stage.addChild(gameOver.gameOverScene);
  music.pause();

  scoreboard.resetScore();
  stateTransition(GameOverState);

  farmer.visible = false;
  gameOver.gameOverScene.visible = true;
}

// ! START GAME FUNCTION
function startGame() {

  gameOver.gameOverScene.visible = false;
  if(currentState === GameOverState) {
    setup()
  }
  stateTransition(PlayState);
}

// !  STATE TRANSITION
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
