/*
Author: Reginald McPherson
Student ID: 0136897
Course: DGL-209 Capstone Project
Modified: 2023-03-015
*/

import Scoreboard from "./scenes/scoreboard.js";
import TitleScreen from "./scenes/titlescreen.js";
import GameOver from "./scenes/gameover.js";
import Player from "./entities/player.js";
import { TitleScreenState, PlayState, GameOverState } from "./helpers/stateMachine.js";
import { waveConfig } from "./config.js";
import { Container, Sprite } from "pixi.js";
import { createHearts } from "./entities/hearts.js";
import { loadProgressHandler } from "./helpers/loadProgress.js";
import { createBackground } from "./helpers/createBackground.js";
import { moveEnemies } from "./entities/enemyMovement.js";
import { createBullet } from "./entities/bullet.js";
import { moveBullets } from "./entities/bulletMovement.js";
import { shoot } from "./entities/shoot.js";
import { spawnEnemies } from "./entities/spawn.js";
import { Timer } from "./helpers/timer.js";
import { rotateTowards } from "./helpers/rotateTowards.js";
import { setupKeyboard } from "./entities/keyboardMovement.js";
import { getAnimation } from "./helpers/textureUtils.js";

const Application = PIXI.Application,
  loader = PIXI.Loader.shared,
  resources = PIXI.Loader.shared.resources;

const app = new Application({
  width: 1280,
  height: 720,
  view: document.getElementById("game-canvas"),
  antialias: true,
  transparent: false,
  resolution: 1,
});

document.body.appendChild(app.view);
const { width, height } = app.view;

let titleScreen,
  gameScene,
  uiScene,
  gameOver,
  farmer,
  groundTexture,
  objectTextures,
  screenTextures,
  ecornsTextures,
  bigEnemy,
  farmerDelta,
  heartTexture,
  scoreboard,
  textTextures,
  heartsContainer,
  music,
  timer,
  timerText,
  bgBackground,
  dayNightOverlay;

let bullets;
let enemies;
let currentState = TitleScreenState;
let isRapidFiring = false;
let gameStarted = false;

// Loader
loader.onProgress.add(loadProgressHandler);
loader
  .add("images/screens-spritesheet.json") // *  Textures
  .add("images/obj-spritesheet.json") // *  Textures
  .add("images/ecorns-spritesheet.json") // *  Textures
  .add("images/text-spritesheet.json") // *  Textures
  .add("images/ground.jpg") // *  Texture
  .add("images/heart.png") // *  Texture
  .add("IdleFarmer", "images/farmer_idle.json") // *  Animation
  .add("RunFarmer", "images/farmer_run.json") // *  Animation
  .add("HurtFarmer", "images/farmer_hurt.json") // *  Animation
  .add("DeathFarmer", "images/farmer_death.json") // *  Animation
  .add("ShootFarmer", "images/farmer_shoot.json") // *  Animation
  .add("metal", "audio/music/InHeavyMetal.mp3") // *  Audio
  .add("boomopera", "audio/music/Boomopera.mp3") // *  Audio
  .add("shoot", "audio/shot.mp3") // *  Audio
  .load(setup);

// * CREATE GAME OBJECTS====
function createGameObjects() {
  // Create spritesheet.texture(s), and sprite.texture
  screenTextures = resources["images/screens-spritesheet.json"].textures;
  objectTextures = resources["images/obj-spritesheet.json"].textures;
  ecornsTextures = resources["images/ecorns-spritesheet.json"].textures;
  textTextures = resources["images/text-spritesheet.json"].textures;
  groundTexture = resources["images/ground.jpg"].texture;
  heartTexture = resources["images/heart.png"].texture;
  // Game scenes
  gameScene = new Container();
  gameScene.visible = false;

  uiScene = new Container();
  uiScene.visible = false;
  
  // Create farmer
  farmer = createPlayer();
  gameScene.addChild(farmer);

  // Create hearts container
  heartsContainer = createHearts(app, heartTexture);
  heartsContainer.position.set(10, 10);
  uiScene.addChild(heartsContainer);

  // Create the scoreboard
  scoreboard = new Scoreboard();
  uiScene.addChild(scoreboard.scoreboard);

  // Create background
  bgBackground = createBackground(new Sprite(groundTexture).texture, app);
  app.stage.addChild(bgBackground);

  // Create day/night overlay
  createDayNightOverlay();

  // Gameplay Music
  music = new Audio(resources["metal"].url);

  // Create Titlescreen

  titleScreen = new TitleScreen(app, startGame, screenTextures, textTextures);

  // Create game over screen
  gameOver = new GameOver(app, scoreboard, setup, screenTextures);

  // Timer
  createTimerText();
  timer = new Timer(timerText, endGame, (currentTime) => {
    const maxAlpha = 0.8; // Max darkness 0 - 1
    const alphaIncrement = maxAlpha / timer.startTime;
    const newAlpha = alphaIncrement * currentTime;
    dayNightOverlay.alpha = Math.max(0, Math.min(maxAlpha, newAlpha));
  });
} // ! CREATE GAME OBJECTS END

// * INITIALIZE VARIABLES START
function initializeVariables() {
  bullets = [];
  enemies = [];
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
  createBullets(100, objectTextures);

  // Add title and game screen to stage
  app.stage.addChild(titleScreen.titleScene);
  app.stage.addChild(gameScene);

  app.stage.addChild(uiScene);
  app.ticker.add((delta) => gameLoop(delta));
} // ! SETUP END

// * GAME LOOP START
function gameLoop(delta) {
  if (currentState === PlayState) {
    play(delta);
  }


  // Check for 0 hearts (game over)
  if (currentState == PlayState && heartsContainer.children.length == 0) {
    farmer.setAnimation("die");
    app.stage.interactive = false;
    endGame();

    playGameOverMusic();
  }
} // ! GAME LOOP END





// * PLAY START
//=================================================================================
function play(delta) {
  // Play music
  playMusic();

  // TODO: This is a temporary fix for the farmer animation bug
  ((farmer.vx != 0 || farmer.vy != 0) && farmer.animation != "run") ? farmer.setAnimation("run") : null;

  // Farmer movement since last frame, use to calculate movement of enemies and bullets with infinite scroll bg
  const farmerDelta = (delta = {
    x: farmer.vx * delta,
    y: farmer.vy * delta,
  });

  // Moves the bg with the farmer
  updateBG(farmerDelta);

  // Movement of Enemies and bullets, and collision detection
  moveEnemies(enemies, farmer, farmerDelta, heartsContainer, gameScene);
  moveBullets(
    bullets,
    enemies,
    scoreboard,
    gameScene,
    width,
    height,
    farmerDelta,
    farmer
  );

  // Check score for win
  scoreboard.score >= waveConfig.scoreToWin ? endGame() : null;
} // ! PLAY END

// * END GAME START
function endGame() {
  gameOver = new GameOver(app, scoreboard.score, startGame, screenTextures);
  app.stage.addChild(gameOver.gameOverScene);
  app.stage.removeChild(gameScene);

  // Stop the game music
  music.pause();

  // Reset score
  scoreboard.resetScore();
  stateTransition(GameOverState);

  // Remove all enemies
  enemies.forEach((enemy) => gameScene.removeChild(enemy));

  // Remove all bullets
  bullets.forEach((bullet) => gameScene.removeChild(bullet));

  // Remove farmer from view
  farmer.visible = false;

  // gameover screen
  gameOver.gameOverScene.visible = true;
} // ! END GAME END

// * START GAME START
function startGame() {

  gameStarted = true;
  console.log("start game");
    // Create enemies
    spawnEnemies(
      waveConfig.numWaves,
      waveConfig.waveDelaySec,
      waveConfig.enemyCount,
      waveConfig.enemySpeed,
      gameScene,
      enemies,
      ecornsTextures,
      app,
      farmer,
      timer,
      gameStarted,
    );

  // Hide title screen
  titleScreen.titleScene.visible = false;

  // Hide game over screen
  gameOver.gameOverScene.visible = false;

  // Start a new game
  if (currentState === GameOverState) {
    setup();
  }

  // Switch to play state
  stateTransition(PlayState);

  // Start the timer
  timer.start();
} // ! START GAME END

// * STATE TRANSITION START
function stateTransition(nextState = TitleScreenState) {
  TitleScreen.visible ? (uiScene.visible = false) : (uiScene.visible = true);
  currentState = nextState;
  titleScreen.titleScene.visible = currentState === TitleScreenState;
  gameScene.visible = currentState === PlayState;
  gameOver.gameOverScene.visible = currentState === GameOverState;
} // ! STATE TRANSITION END

// *HELPER FUNCTIONS
//*=========================================================
function createTimerText() {
  timerText = new PIXI.Text("Time: 60", {
    fontFamily: "Arial",
    fontSize: 36,
    fill: "white",
    stroke: "orange",
    strokeThickness: 4,
    dropShadow: true,
    dropShadowColor: "#000000",
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    wordWrap: true,
    wordWrapWidth: 440,
  });
  timerText.position.set(width - 200, height - 700);
  gameScene.addChild(timerText);
}

// * Event Listeners
//*=========================================================
function setupEventListeners() {
  app.stage.interactive = true;

  app.stage.on("pointermove", (event) => {
    farmer.rotation = rotateTowards(event, farmer);
  });

  // Rapid fire
  app.view.addEventListener("mousedown", () => {
    if (currentState === PlayState) {
      farmer.setAnimation("shoot");
      isRapidFiring = true;
      rapidFire();
    }
  });

  app.view.addEventListener("mouseup", () => {
    farmer.setAnimation("idle");
    isRapidFiring = false;
  });
} // ! Event Listeners

function createBullets(projectileLimit, texture) {
  for (let i = 0; i < projectileLimit; i++) {
    let projectile = createBullet(texture);
    bullets.push(projectile);
  }
}

let gameOverMusic;

function playGameOverMusic() {
  if (gameOverMusic) {
    gameOverMusic.pause();
  }

  gameOverMusic = new Audio(resources["boomopera"].url);
  gameOverMusic.loop = false;
  gameOverMusic.muted = false;

  gameOverMusic.oncanplaythrough = () => {
    gameOverMusic.play();
  };

  gameOverMusic.onended = () => {
    gameOverMusic.muted = true;
  };
}

function playMusic() {
  if (!music.isPlaying) {
    music.play();
    music.isPlaying = true;
  }

  music.onended = () => {
    music.isPlaying = false;
  };
}

// Move tiling background based on farmer movement input
function updateBG(farmerDelta) {
  bgBackground.tilePosition.x -= farmerDelta.x;
  bgBackground.tilePosition.y -= farmerDelta.y;
}

function createDayNightOverlay() {
  dayNightOverlay = new PIXI.Graphics();
  dayNightOverlay.beginFill(0x000033);
  dayNightOverlay.drawRect(0, 0, width, height);
  dayNightOverlay.endFill();
  dayNightOverlay.alpha = 0.8;
  gameScene.addChild(dayNightOverlay);
}

function rapidFire() {
  if (isRapidFiring) {
    shoot(farmer, bullets, gameScene, new Audio(resources["shoot"].url));
    setTimeout(rapidFire, 70); // Adjust the delay between shots as needed
  }
}

// Create PLAYER
//==============================
function createPlayer() {

  // Animation textures
  const idleTextures  = getAnimation(loader.resources, "IdleFarmer",  "idle");
  const runTextures   = getAnimation(loader.resources, "RunFarmer",   "run_with_gun");
  const hurtTextures  = getAnimation(loader.resources, "HurtFarmer",  "hurt");
  const deathTextures = getAnimation(loader.resources, "DeathFarmer", "die");
  const shootTextures = getAnimation(loader.resources, "ShootFarmer", "shoot");

  // Create player
  let player = new Player();

  // Setup player animations
  player.initAnimations(
    idleTextures,
    shootTextures,
    runTextures,
    hurtTextures,
    deathTextures
  );

  // Setup player position
  player.x = app.view.width / 2;
  player.y = app.view.height / 2;

  // Setup player movement and return
  return setupKeyboard(player);
}
