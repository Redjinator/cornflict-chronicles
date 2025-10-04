/*
Author: Reginald McPherson
Student ID: 0136897
Course: DGL-209 Capstone Project
Modified: 2023-03-015
*/

import Scoreboard from "./scenes/scoreboard.js";
import TitleScreen from "./scenes/titlescreen.js";
import GameOver from "./scenes/gameover.js";
import WinScreen from "./scenes/winscreen.js";
import PauseScreen from "./scenes/pausescreen.js";
import Player from "./entities/player.js";
import { TitleScreenState, PlayState, PausedState, GameOverState } from "./helpers/stateMachine.js";
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
import { ScreenShake } from "./helpers/screenShake.js";
import { WeaponSystem } from "./helpers/weaponSystem.js";
import { PowerUpCard } from "./entities/powerup.js";
import { cullSprites } from "./helpers/spriteculling.js";
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
  winScreen,
  pauseScreen,
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
let powerUps;
let weaponSystem;
let currentState = TitleScreenState;
let isRapidFiring = false;
let gameStarted = false;
let screenShake;
let isInvincible = false;
let invincibilityTimer = 0;
const INVINCIBILITY_DURATION = 1500; // 1.5 seconds in milliseconds
const POWERUP_DROP_CHANCE = 0.5; // 50% chance to drop power-up (increased for testing)

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

  // Initialize screen shake for game scene
  screenShake = new ScreenShake(gameScene);

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
  uiScene.addChild(scoreboard.getContainer());

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

  // Create pause screen
  pauseScreen = new PauseScreen(app, resumeGame);
  pauseScreen.pauseScene.visible = false;
  app.stage.addChild(pauseScreen.pauseScene);

  // Timer
  createTimerText();
  timer = new Timer(timerText, () => endGame(true), (currentTime) => {
    const maxAlpha = 0.8; // Max darkness 0 - 1
    // Calculate elapsed time (how much time has passed)
    const elapsedTime = timer.startTime - currentTime;
    const alphaIncrement = maxAlpha / timer.startTime;
    const newAlpha = alphaIncrement * elapsedTime;
    dayNightOverlay.alpha = Math.max(0, Math.min(maxAlpha, newAlpha));
  });
} // ! CREATE GAME OBJECTS END

// * INITIALIZE VARIABLES START
function initializeVariables() {
  bullets = [];
  enemies = [];
  powerUps = [];
  weaponSystem = new WeaponSystem();
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

    // Update invincibility timer
    if (isInvincible) {
      invincibilityTimer -= delta * 16.67; // Convert delta to ms (assuming 60fps)

      // Flash effect during invincibility
      const flashSpeed = 8;
      farmer.alpha = Math.abs(Math.sin(Date.now() / (1000 / flashSpeed)));

      if (invincibilityTimer <= 0) {
        isInvincible = false;
        farmer.alpha = 1; // Reset to fully visible
      }
    }
  }

  // Update screen shake
  if (screenShake) {
    screenShake.update(delta);
  }

  // Check for 0 hearts (game over)
  if (currentState == PlayState && heartsContainer.children.length == 0) {
    farmer.setAnimation("die");
    app.stage.interactive = false;
    endGame(false);

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
  const farmerDelta = {
    x: farmer.vx * delta,
    y: farmer.vy * delta,
  };

  // Moves the bg with the farmer
  updateBG(farmerDelta);

  // Movement of Enemies and bullets, and collision detection
  moveEnemies(enemies, farmer, farmerDelta, heartsContainer, gameScene, screenShake, {
    isInvincible,
    setInvincible: () => {
      isInvincible = true;
      invincibilityTimer = INVINCIBILITY_DURATION;
    }
  });
  moveBullets(
    bullets,
    enemies,
    scoreboard,
    gameScene,
    width,
    height,
    farmerDelta,
    farmer,
    dropPowerUp
  );

  // Update power-ups
  updatePowerUps(delta, farmerDelta);

  // Check power-up collisions
  checkPowerUpCollisions();

  // Cull off-screen sprites for performance
  cullSprites(enemies, { width, height });
  cullSprites(bullets, { width, height });

  // Check score for win (removed - win is only by surviving timer)
} // ! PLAY END

// * POWER-UP FUNCTIONS START
function updatePowerUps(delta, farmerDelta) {
  for (let i = powerUps.length - 1; i >= 0; i--) {
    const powerUp = powerUps[i];
    powerUp.update(delta, farmerDelta);

    // Remove if off-screen
    if (powerUp.y > height + 100) {
      gameScene.removeChild(powerUp);
      powerUps.splice(i, 1);
    }
  }
}

function checkPowerUpCollisions() {
  for (let i = powerUps.length - 1; i >= 0; i--) {
    const powerUp = powerUps[i];
    const distance = Math.sqrt(
      Math.pow(farmer.x - powerUp.x, 2) + Math.pow(farmer.y - powerUp.y, 2)
    );

    if (distance < 50 && !powerUp.collected) {
      powerUp.collected = true;
      collectPowerUp(powerUp, i);
    }
  }
}

function collectPowerUp(powerUp, index) {
  // Upgrade weapon
  const upgraded = weaponSystem.powerUp();

  // Visual feedback
  gameScene.removeChild(powerUp);
  powerUps.splice(index, 1);

  // Create level-up text
  const levelText = new PIXI.Text(
    upgraded ? `LEVEL ${weaponSystem.getLevel()}!` : "MAX LEVEL!",
    {
      fontFamily: "Arial",
      fontSize: 32,
      fill: 0xFFD700,
      stroke: 0xFF6600,
      strokeThickness: 4,
    }
  );
  levelText.anchor.set(0.5);
  levelText.x = farmer.x;
  levelText.y = farmer.y - 60;
  gameScene.addChild(levelText);

  // Animate and remove text
  let textAlpha = 1;
  let textY = levelText.y;
  const textInterval = setInterval(() => {
    textAlpha -= 0.05;
    textY -= 2;
    levelText.alpha = textAlpha;
    levelText.y = textY;

    if (textAlpha <= 0) {
      gameScene.removeChild(levelText);
      clearInterval(textInterval);
    }
  }, 50);

  // Power-up sound (using yippee sound)
  const powerUpSound = new Audio("/audio/yippee.mp3");
  powerUpSound.volume = 0.3;
  powerUpSound.play();
}

function dropPowerUp(x, y) {
  if (Math.random() < POWERUP_DROP_CHANCE) {
    const powerUp = new PowerUpCard(x, y);
    powerUps.push(powerUp);
    gameScene.addChild(powerUp);
  }
}
// ! POWER-UP FUNCTIONS END

// * PAUSE GAME START
function pauseGame() {
  console.log("pause game");

  // Stop the timer
  if (timer) {
    timer.stop();
  }

  // Pause the music
  if (music && !music.paused) {
    music.pause();
  }

  // Show pause screen
  pauseScreen.pauseScene.visible = true;

  // Switch to paused state
  currentState = PausedState;
} // ! PAUSE GAME END

// * RESUME GAME START
function resumeGame() {
  console.log("resume game");

  // Hide pause screen
  pauseScreen.pauseScene.visible = false;

  // Resume the timer
  if (timer) {
    timer.start();
  }

  // Resume the music
  if (music && music.paused) {
    music.play();
  }

  // Switch back to play state
  currentState = PlayState;
} // ! RESUME GAME END

// * END GAME START
function endGame(isVictory = false) {
  // Stop the timer
  if (timer) {
    timer.stop();
    timer.reset();
  }

  // Stop the game music
  if (music) {
    music.pause();
    music.currentTime = 0;
  }

  // Remove all enemies
  enemies.forEach((enemy) => {
    if (enemy.parent) {
      gameScene.removeChild(enemy);
    }
  });
  enemies.length = 0; // Clear the array

  // Remove all bullets
  bullets.forEach((bullet) => {
    if (bullet.parent) {
      gameScene.removeChild(bullet);
    }
  });

  // Remove all power-ups
  powerUps.forEach((powerUp) => {
    if (powerUp.parent) {
      gameScene.removeChild(powerUp);
    }
  });
  powerUps.length = 0;

  // Remove farmer from view
  farmer.visible = false;

  // Hide game scenes
  gameScene.visible = false;
  uiScene.visible = false;

  // Update high score
  const isNewHighScore = scoreboard.updateHighScore();

  if (isVictory) {
    // Create and show win screen
    winScreen = new WinScreen(app, scoreboard.getScore(), restartGame, screenTextures, textTextures, isNewHighScore);
    app.stage.addChild(winScreen.winScene);
    winScreen.winScene.visible = true;
  } else {
    // Create and show game over screen
    gameOver = new GameOver(app, scoreboard.getScore(), restartGame, screenTextures, isNewHighScore);
    app.stage.addChild(gameOver.gameOverScene);
    gameOver.gameOverScene.visible = true;
  }

  stateTransition(GameOverState);
} // ! END GAME END

// * START GAME START
function startGame() {
  gameStarted = true;
  console.log("start game");

  // Reset invincibility
  isInvincible = false;
  invincibilityTimer = 0;
  farmer.alpha = 1;

  // Reset weapon level
  if (weaponSystem) {
    weaponSystem.reset();
  }

  // Hide title screen
  titleScreen.titleScene.visible = false;

  // Hide game over screen if it exists
  if (gameOver && gameOver.gameOverScene) {
    gameOver.gameOverScene.visible = false;
  }

  // Hide win screen if it exists
  if (winScreen && winScreen.winScene) {
    winScreen.winScene.visible = false;
  }

  // Show game scenes
  gameScene.visible = true;
  uiScene.visible = true;

  // Reset farmer
  farmer.visible = true;
  farmer.x = app.view.width / 2;
  farmer.y = app.view.height / 2;
  farmer.rotation = 0;
  farmer.setAnimation("idle");

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

  // Switch to play state
  stateTransition(PlayState);

  // Start the timer
  timer.start();
} // ! START GAME END

// * RESTART GAME START
function restartGame() {
  console.log("restart game");

  // Re-enable interactivity
  app.stage.interactive = true;

  // Stop all audio
  if (gameOverMusic) {
    gameOverMusic.pause();
    gameOverMusic.currentTime = 0;
    gameOverMusic = null;
  }

  // Stop win screen victory sound if it exists
  if (winScreen && winScreen.victorySound) {
    winScreen.victorySound.pause();
    winScreen.victorySound.currentTime = 0;
  }

  // Reset game music
  if (music) {
    music.pause();
    music.currentTime = 0;
    music.isPlaying = false;
  }

  // Reset score
  scoreboard.resetScore();

  // Reset timer
  timer.reset();

  // Reset day/night overlay
  dayNightOverlay.alpha = 0;

  // Recreate hearts - remove old container and create fresh one
  if (heartsContainer && heartsContainer.parent) {
    uiScene.removeChild(heartsContainer);
  }
  heartsContainer = createHearts(app, heartTexture);
  heartsContainer.position.set(10, 10);
  uiScene.addChild(heartsContainer);

  // Remove game over screen
  if (gameOver && gameOver.gameOverScene && gameOver.gameOverScene.parent) {
    app.stage.removeChild(gameOver.gameOverScene);
  }

  // Remove win screen
  if (winScreen && winScreen.winScene && winScreen.winScene.parent) {
    app.stage.removeChild(winScreen.winScene);
  }

  // Start a new game
  startGame();
} // ! RESTART GAME END

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
  timerText = new PIXI.Text("Time: 90", {
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
  timerText.anchor.set(1, 0); // Anchor to top-right
  timerText.position.set(width - 20, 20); // Better positioning
  uiScene.addChild(timerText); // Move to UI scene for consistency
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

  // Pause/Resume with ESC key
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" || event.keyCode === 27) {
      if (currentState === PlayState) {
        pauseGame();
      } else if (currentState === PausedState) {
        resumeGame();
      }
    }
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
    music.loop = true; // Enable looping
    music.volume = 0.6; // Set volume
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
  dayNightOverlay.alpha = 0; // Start at day (0 = full daylight)
  gameScene.addChild(dayNightOverlay);
}

function rapidFire() {
  if (isRapidFiring) {
    shoot(farmer, bullets, gameScene, new Audio(resources["shoot"].url), weaponSystem);
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
