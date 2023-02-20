/*
Author: Reginald McPherson
Student ID: 0136897
Course: DGL-209 Capstone Project
Date: 2023-02-10

Plan
--------------------------------
Next: collsions
Then: score and health
Then: levels and waves

Then: game over and restart
Then: game win
Then: high score screen
Then: main menu
*/


/* #region Imports and Aliases */
import { keyboard } from './keyboard.js'
import { setSpriteProperties, loadProgressHandler, randomSpawnPoint } from './myfunctions.js';
import { Container, TextStyle } from 'pixi.js';
import { hitTestRectangle } from './collisions.js';
import MainMenu from './mainmenu.js';
import Victor from 'victor';
import HighScore from './highscore.js';



const Application = PIXI.Application,
  loader = PIXI.Loader.shared,
  TextureCache = PIXI.utils.TextureCache,
  resources = PIXI.Loader.shared.resources,
  Text = PIXI.Text,
  Sprite = PIXI.Sprite,
  graphics = new PIXI.Graphics();
/* #endregion Imports and Aliases */

/* #region Application */
//-----------------------
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



// Create variables
//-----------------------
let gameScene, farmer, enemy, fieldbg, id, state, score, scoreboard, mouseTarget, heartsContainer;
let bullets = [];
let enemies = [];
let bulletLimit =10;
let initialWaveCount = 10;
let enemyCount = 5;
let enemySpeed = 1;



// Loader
//-----------------------
loader.onProgress.add(loadProgressHandler);

loader
  .add('images/mvp-spritesheet.json')
  .load(setup);


  
/* #endregion Application */

/* #region Setup */
function setup() {

  // Set score to 0
  score = 0;

  // Create the game scene
  gameScene = new Container();



  // Alias called id for all the texture atlas frame id textures
  id = resources["images/mvp-spritesheet.json"].textures;

  // Create the sprites with the setSpriteProperties function (sprite, anchor, scale, positionX, positionY) cx and cy are set to 0 internally by default.
  fieldbg = setSpriteProperties(new Sprite(id["field-bg.png"]), 1, 1, 1280, 720);
  farmer  = setSpriteProperties(new Sprite(id["farmer-v3.png"]), 0.5, 0.2, 640, 600);



  // Scene management
  const mainMenu = new MainMenu({app, gameScene});
  app.stage.addChild(mainMenu.menuScene);
  gameScene.addChild(fieldbg);
  gameScene.addChild(farmer);

  heartsContainer = new Container();
  const maxHearts = 5;
  
  graphics.beginFill(0xff0000); // Set the fill color to red
  graphics.moveTo(75, 40); // Move to the top point of the heart shape
  graphics.bezierCurveTo(75, 37, 70, 25, 50, 25); // Draw the left curve of the heart shape
  graphics.bezierCurveTo(20, 25, 20, 62.5, 20, 62.5); // Draw the bottom-left curve of the heart shape
  graphics.bezierCurveTo(20, 80, 40, 102, 75, 120); // Draw the bottom-right curve of the heart shape
  graphics.bezierCurveTo(110, 102, 130, 80, 130, 62.5); // Draw the top-right curve of the heart shape
  graphics.bezierCurveTo(130, 62.5, 130, 25, 100, 25); // Draw the top-left curve of the heart shape
  graphics.bezierCurveTo(85, 25, 75, 37, 75, 40); // Close the heart shape
  graphics.endFill();

  const heartTexture = app.renderer.generateTexture(graphics);
  const heart = new PIXI.Sprite(heartTexture);
  
  // Add the hearts to the container
  for (let i = 0; i < maxHearts; i++) {
    const heart = new PIXI.Sprite(heartTexture);
    heart.scale.set(0.2); // Set the size of the heart
    heart.x = i * (heart.width + 10); // Position each heart
    heartsContainer.addChild(heart); // Add the heart to the container
  }

  gameScene.addChild(heartsContainer);




  /* #region Capture the keyboard arrow keys */
  const left = keyboard(65),
        up = keyboard(87),
        right = keyboard(68),
        down = keyboard(83);

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
  scoreboard = new Text("Score:" + score, scoreBoardStyle);
  scoreboard.anchor.set(0.5, 0.5);
  scoreboard.position.set(gameScene.width / 2, 100);
  gameScene.addChild(scoreboard);
  /* #endregion */

  /* #region Create Mouse Target */
  //=================================================
  // Create a target sprite
  mouseTarget = app.stage.addChild(new PIXI.Graphics().beginFill(0xffffff).lineStyle({color: 0x111111, alpha: 0.5, width: 1}).drawCircle(0,0,8).endFill());
  mouseTarget.position.set(app.screen.width / 2, app.screen.height / 2);
  app.stage.interactive = true;

  // Move the target when the mouse moves
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

}
/* #endregion */

// ===================== END OF SETUP =====================




/* #region Function gameLoop */
function gameLoop(delta) {

  // Update the current game state:
  // Because gameLoop is calling state 60 times per second, it means play function will also run 60 times per second.
  state(delta);

  // Check if farmer is out of hearts
  if (heartsContainer.children.length == 0) {
    state = end;
  }
}
/* #endregion */

/* #region Function play*/
function play(delta) {

  // Farmer movement
  farmer.x += farmer.vx;
  farmer.y += farmer.vy;

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



  // Move enemies
  for (let i = 0; i < enemies.length; i++) {
    let enemy = enemies[i];
    let e = new Victor(enemy.x, enemy.y);
    let f = new Victor(farmer.x, farmer.y);
    let d = f.subtract(e);
    let v = d.normalize().multiplyScalar(enemySpeed);
    enemy.position.set(enemy.position.x + v.x, enemy.position.y + v.y);

      if (hitTestRectangle(farmer, enemy)) {
        gameScene.removeChild(enemy);
        enemies.splice(i, 1);
        heartsContainer.removeChildAt(heartsContainer.children.length - 1);
        break;
      }
  }

  // Bullet movement and collision
  for (let i = 0; i < bullets.length; i++) {
    let bullet = bullets[i];
    if (bullet.parent) {
      bullet.x += bullet.vx;
      bullet.y += bullet.vy;

      for (let j = 0; j < enemies.length; j++) {
        let enemy = enemies[j];
        if (hitTestRectangle(bullet, enemy)) {
          score += 1;
          scoreboard.text = "Score:" + score;
          gameScene.removeChild(bullet);
          gameScene.removeChild(enemy);
          enemies.splice(j, 1);
          break;
        }
      }

      if (bullet.x < 0 || bullet.x > app.screen.width || bullet.y < 0 || bullet.y > app.screen.height) {
        gameScene.removeChild(bullet);
      }
    }
  }
}
//-----
/* #endregion */

/* #region Function end */
function end() {
  console.log("Game Over");



  const highScore = new HighScore(score);
  app.stage.addChild(highScore.highScoreScene);
}
/* #endregion */

/* #region Scoreboard */
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



