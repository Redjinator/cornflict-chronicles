//import './style.css'

import { keyboard } from './keyboard.js'
import './myfunctions.js'
import { setSpriteProperties, loadProgressHandler } from './myfunctions.js';
import { Container, TextStyle } from 'pixi.js';
import { hitTestRectangle } from './collisions.js';

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

// Define any variables that are used in more than one function, making them available globally
let farmer, enemy, fieldbg, bullet, id, state, score;

// Define groups
const gameScene = new Container();

//========================================================================================
//========================================================================================


// use loader
// ----------------------
loader.onProgress.add(loadProgressHandler);

loader
  .add('images/mvp-spritesheet.json')
  .load(setup);



/* #region Setup */
//----------------------
// Setup function
//----------------------
function setup() {

  // This code will run, when the loader finishes loading the images
  console.log("All files loaded");

  // Set score to 0
  score = 0;

  /* #region Create Sprites */
  // Alias called id for all the texture atlas frame id textures
  id = resources["images/mvp-spritesheet.json"].textures;

  // Create the sprites with the setSpriteProperties function (sprite, anchor, scale, positionX, positionY) cx and cy are set to 0 internally by default.
  fieldbg = setSpriteProperties(new Sprite(id["field-bg.png"]), 1, 1, 1280, 720);
  farmer = setSpriteProperties(new Sprite(id["farmer-v3.png"]), 0.5, 0.2, 400, 100);

  gameScene.addChild(fieldbg);
  gameScene.addChild(farmer);

  // Add the sprites to the stage
  app.stage.addChild(gameScene);
  /* #endregion */

  /* #region Capture the keyboard arrow keys */
  const left = keyboard(37),
        up = keyboard(38),
        right = keyboard(39),
        down = keyboard(40);

  //Left arrow key `press` method
  left.press = () => {farmer.vx = -5; farmer.vy = 0;};
  left.release = () => { if (!right.isDown && farmer.vy === 0) { farmer.vx = 0; }};

  //Up
  up.press = () => {farmer.vy = -5; farmer.vx = 0;};
  up.release = () => { if (!down.isDown && farmer.vx === 0) { farmer.vy = 0; }};

  //Right
  right.press = () => {farmer.vx = 5; farmer.vy = 0;};
  right.release = () => { if (!left.isDown && farmer.vy === 0) { farmer.vx = 0; }};

  //Down
  down.press = () => {farmer.vy = 5; farmer.vx = 0;};
  down.release = () => { if (!up.isDown && farmer.vx === 0) { farmer.vy = 0; }};
/* #endregion */

  /* #region Create Scoreboard */
  const scoreboard = new Text("Score:" + score, scoreBoardStyle);
  scoreboard.anchor.set(0.5, 0.5);
  scoreboard.position.set(gameScene.width / 2, 100);
  gameScene.addChild(scoreboard);
  /* #endregion */

  // Set the game state
  state = play;

  // Starts game loop - Calls gameLoop every tick
  app.ticker.add(delta => gameLoop(delta));

}
/* #endregion */



/* #region Function gameLoop */
function gameLoop(delta) {

  // Update the current game state:
  // Because gameLoop is calling state 60 times per second, it means play function will also run 60 times per second.
  state(delta);
}
/* #endregion */


/* #region Function play*/
function play(delta) {
  // Move the farmer
  farmer.x += farmer.vx;
  farmer.y += farmer.vy;
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
