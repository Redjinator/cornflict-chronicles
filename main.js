/*

Author: Reginald McPherson
Student ID: 0136897
Course: DGL-209 Capstone Project
Date: 2023-02-10



Next: collsions
Then: score and health
Then: levels and waves
Then: enemy movement
Then: game over and restart
Then: game win
Then: high score screen
Then: main menu
*/


/* #region Imports */
import { keyboard } from './keyboard.js'
import './myfunctions.js'
import { setSpriteProperties, loadProgressHandler, fire } from './myfunctions.js';
import { Container, TextStyle } from 'pixi.js';
import { hitTestRectangle } from './collisions.js';
import Victor from 'victor';
/* #endregion */

/* #region Aliases */
const Application = PIXI.Application,
  loader = PIXI.Loader.shared,
  TextureCache = PIXI.utils.TextureCache,
  resources = PIXI.Loader.shared.resources,
  Text = PIXI.Text,
  Sprite = PIXI.Sprite;
/* #endregion */

/* #region Pixi Application */
const app = new Application({
  width: 1280,
  height: 720,
  antialias: true,
  transparent: false,
  resolution: 1
});

// Add canvas created by Pixi to the DOM
document.body.appendChild(app.view);

// Change the background color of the canvas (app.view)
app.renderer.backgroundColor = 0x061639;

// Get the width and height of the canvas
const { width, height } = app.view;

// Log the width and height of the canvas
console.log(width, height);
/* #endregion */

/* #region Variables */
let gameScene, farmer, enemy, fieldbg, bullet, id, state, score;
let bullets = [];
let enemies = [];
let bulletLimit =10;
let enemyCount = 10;
/* #endregion */

/* #region loader */
loader.onProgress.add(loadProgressHandler);

loader
  .add('images/mvp-spritesheet.json')
  .load(setup);
/* #endregion */

/* #region Setup */
function setup() {

  /* #region Create Containers & Sprites */

  // Set score to 0
  score = 0;

  // Create the game scene
  gameScene = new Container();

  // Alias called id for all the texture atlas frame id textures
  id = resources["images/mvp-spritesheet.json"].textures;

  // Create the sprites with the setSpriteProperties function (sprite, anchor, scale, positionX, positionY) cx and cy are set to 0 internally by default.
  fieldbg = setSpriteProperties(new Sprite(id["field-bg.png"]), 1, 1, 1280, 720);
  farmer  = setSpriteProperties(new Sprite(id["farmer-v3.png"]), 0.5, 0.2, 640, 600);
  enemy   = setSpriteProperties(new Sprite(id["enemy.png"]), 0.5, 0.2, 100, 100);

  // Scene management
  gameScene.addChild(fieldbg);
  gameScene.addChild(farmer);
  app.stage.addChild(gameScene);
  /* #endregion */

  /* #region Capture the keyboard arrow keys */
  const left = keyboard(37),
        up = keyboard(38),
        right = keyboard(39),
        down = keyboard(40);

//Left arrow key `press` method
left.press = () => {
  if (up.isDown) {
    farmer.vx = -5;
    farmer.vy = -5;
  } else if (down.isDown) {
    farmer.vx = -5;
    farmer.vy = 5;
  } else {
    farmer.vx = -5;
    farmer.vy = 0;
  }
};

left.release = () => {
  if (!right.isDown && !up.isDown && !down.isDown) {
    farmer.vx = 0;
    farmer.vy = 0;
  } else if (right.isDown) {
    farmer.vx = 5;
    farmer.vy = 0;
  } else if (up.isDown) {
    farmer.vx = 0;
    farmer.vy = -5;
  } else if (down.isDown) {
    farmer.vx = 0;
    farmer.vy = 5;
  }
};

//Up
up.press = () => {
  if (left.isDown) {
    farmer.vx = -5;
    farmer.vy = -5;
  } else if (right.isDown) {
    farmer.vx = 5;
    farmer.vy = -5;
  } else {
    farmer.vx = 0;
    farmer.vy = -5;
  }
};

up.release = () => {
  if (!down.isDown && !left.isDown && !right.isDown) {
    farmer.vx = 0;
    farmer.vy = 0;
  } else if (right.isDown) {
    farmer.vx = 5;
    farmer.vy = 0;
  } else if (left.isDown) {
    farmer.vx = -5;
    farmer.vy = 0;
  } else if (down.isDown) {
    farmer.vx = 0;
    farmer.vy = 5;
  }
};

//Right
right.press = () => {
  if (up.isDown) {
  farmer.vx = 5;
  farmer.vy = -5;
  } else if (down.isDown) {
  farmer.vx = 5;
  farmer.vy = 5;
  } else {
  farmer.vx = 5;
  farmer.vy = 0;
  }
  };
  
  right.release = () => {
  if (!left.isDown && !up.isDown && !down.isDown) {
  farmer.vx = 0;
  farmer.vy = 0;
  } else if (left.isDown) {
  farmer.vx = -5;
  farmer.vy = 0;
  } else if (up.isDown) {
  farmer.vx = 0;
  farmer.vy = -5;
  } else if (down.isDown) {
  farmer.vx = 0;
  farmer.vy = 5;
  }
  };
  
  //Down
  down.press = () => {
  if (left.isDown) {
  farmer.vx = -5;
  farmer.vy = 5;
  } else if (right.isDown) {
  farmer.vx = 5;
  farmer.vy = 5;
  } else {
  farmer.vx = 0;
  farmer.vy = 5;
  }
  };
  
  down.release = () => {
  if (!up.isDown && !left.isDown && !right.isDown) {
  farmer.vx = 0;
  farmer.vy = 0;
  } else if (right.isDown) {
  farmer.vx = 5;
  farmer.vy = 0;
  } else if (left.isDown) {
  farmer.vx = -5;
  farmer.vy = 0;
  } else if (up.isDown) {
  farmer.vx = 0;
  farmer.vy = -5;
  }
  };
/* #endregion */

  /* #region Create Scoreboard */
  const scoreboard = new Text("Score:" + score, scoreBoardStyle);
  scoreboard.anchor.set(0.5, 0.5);
  scoreboard.position.set(gameScene.width / 2, 100);
  gameScene.addChild(scoreboard);
  /* #endregion */

  /* #region Create Mouse Target */
  const mouseTarget = app.stage.addChild(new PIXI.Graphics().beginFill(0xffffff).lineStyle({color: 0x111111, alpha: 0.5, width: 1}).drawCircle(0,0,8).endFill());
  mouseTarget.position.set(app.screen.width / 2, app.screen.height / 2);
  app.stage.interactive = true;

  app.stage.on('pointermove', (event) => {
    mouseTarget.position.set(event.data.global.x, event.data.global.y);
    farmer.rotation = Math.atan2(mouseTarget.y - farmer.y, mouseTarget.x - farmer.x);
  });
  /* #endregion */



/* #region Create Bullets */
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
/* #endregion */

  /* #region game state and ticker */
  state = play;
  app.ticker.add(delta => gameLoop(delta));
  /* #endregion */

  /* #region Enemies */

  gameScene.addChild(enemy);

  // Random Spawn enemies
  for (let i=0; i<enemyCount; i++) {
    let r = randomSpawnPoint();
    enemies.push(new Sprite(id["enemy.png"]));
    enemies[i].scale.set(0.5, 0.5);
    enemies[i].anchor.set(0.5, 0.5);
    enemies[i].x = r.x;
    enemies[i].y = r.y;
    let e = new Victor(enemies[i].x, enemies[i].y);
    let f = new Victor(farmer.x, farmer.y);
    let d = f.subtract(e);
    let v = d.normalize().multiplyScalar(1);
    enemies[i].position.set(enemies[i].position.x +v.x, enemies[i].position.y + v.y);
    //gameScene.addChild(enemies[i]);
  }
  /* #endregion */


}

// ===================== END OF SETUP =====================









/* #region Function gameLoop */
function gameLoop(delta) {

  // Update the current game state:
  // Because gameLoop is calling state 60 times per second, it means play function will also run 60 times per second.
  state(delta);
}
/* #endregion */

/* #region Function play*/
function play(delta) {

  // Farmer movement
  farmer.x += farmer.vx;
  farmer.y += farmer.vy;

  // Enemy movement to chase farmer
  let e = new Victor(enemy.x, enemy.y);
  let f = new Victor(farmer.x, farmer.y);
  let d = f.subtract(e);
  let v = d.normalize().multiplyScalar(1);
  enemy.position.set(enemy.position.x +v.x, enemy.position.y + v.y);

  for (let i=0; i<bullets.length; i++) {
    let bullet = bullets[i];
    if (bullet.parent) {
        bullet.x += bullet.vx;
        bullet.y += bullet.vy;

        if (hitTestRectangle(bullet, enemy)) {
            score += 1;
            gameScene.removeChild(bullet);
            gameScene.removeChild(enemy);
        }

        if (bullet.x < 0 || bullet.x > app.screen.width || bullet.y < 0 || bullet.y > app.screen.height) {
            gameScene.removeChild(bullet);
        }
    }
  }
}
/* #endregion */

/* #region Function end */
function end() {
  console.log("Game Over");
}
/* #endregion */

/* #region Scoreboard Style */
const scoreBoardStyle = new TextStyle({
  fontFamily: "Arial",
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
/* #endregion */

/* #region Function randomSpawnPoint */
function randomSpawnPoint() {
  let edge = Math.floor(Math.random() * 4);
  let spawnPoint = new Victor(0, Math.random() * 100);
  switch(edge) {
    case 0: // top
      spawnPoint.x = Math.floor(Math.random() * width);
      break;
    case 1: // right
      spawnPoint.x = width;
      spawnPoint.y = Math.floor(Math.random() * height);
      break;
    case 2: // bottom
      spawnPoint.x = Math.floor(Math.random() * width);
      spawnPoint.y = height;
      break;
    default: // left
      spawnPoint.x = 0;
      spawnPoint.y = Math.floor(Math.random() * height);
      break;
  }
  return spawnPoint;
}
/* #endregion */