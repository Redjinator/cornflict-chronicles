//import './style.css'

//import { keyboard } from './keyboard.js'
import './myfunctions.js'
import { setSpriteProperties, loadProgressHandler } from './myfunctions.js';

// Alias
const Application = PIXI.Application,
  loader = PIXI.Loader.shared,
  TextureCache = PIXI.utils.TextureCache,
  resources = PIXI.Loader.shared.resources,
  Sprite = PIXI.Sprite;


/// Pixi App
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

// Define any variables that are used in more than one function, making them available globally
let farmer, enemy, fieldbg, bullet, id, state;

//========================================================================================
//========================================================================================


// use loader
// ----------------------
loader.onProgress.add(loadProgressHandler);

loader
  .add('images/mvp-spritesheet.json')
  .load(setup);




//----------------------
// Setup function
//----------------------
function setup() {

  app.stage.interactive = true;

  // This code will run, when the loader finishes loading the images
  console.log("All files loaded");

  // Alias called id for all the texture atlas frame id textures
  id = resources["images/mvp-spritesheet.json"].textures;

  // Create the sprites with the setSpriteProperties function (sprite, anchor, scale, positionX, positionY) cx and cy are set to 0 internally by default.
  fieldbg = setSpriteProperties(new Sprite(id["field-bg.png"]), 1, 1, 1280, 720);
  farmer = setSpriteProperties(new Sprite(id["farmer-v3.png"]), 0.5, 0.2, 400, 100);

  // Add the sprites to the stage
  app.stage.addChild(fieldbg);
  app.stage.addChild(farmer);

  //Capture the keyboard arrow keys
  const left = keyboard(37),
      up = keyboard(38),
      right = keyboard(39),
      down = keyboard(40);

  //Left arrow key `press` method
  left.press = () => {
    //Change the farmer's velocity when the key is pressed
    farmer.vx = -5;
    farmer.vy = 0;
  };
  
  //Left arrow key `release` method
  left.release = () => {
    //If the left arrow has been released, and the right arrow isn't down,
    //and the farmer isn't moving vertically:
    //Stop the farmer
    if (!right.isDown && farmer.vy === 0) {
      farmer.vx = 0;
    }
  };

  //Up
  up.press = () => {
    farmer.vy = -5;
    farmer.vx = 0;
  };
  up.release = () => {
    if (!down.isDown && farmer.vx === 0) {
      farmer.vy = 0;
    }
  };

  //Right
  right.press = () => {
    farmer.vx = 5;
    farmer.vy = 0;
  };
  right.release = () => {
    if (!left.isDown && farmer.vy === 0) {
      farmer.vx = 0;
    }
  };

  //Down
  down.press = () => {
    farmer.vy = 5;
    farmer.vx = 0;
  };
  down.release = () => {
    if (!up.isDown && farmer.vx === 0) {
      farmer.vy = 0;
    }
  };


  // Set the game state
  state = play;

  // Starts game loop - Calls gameLoop every tick
  app.ticker.add(delta => gameLoop(delta));
}



//----------------------
// Game loop function
//----------------------
function gameLoop(delta) {

  // Update the current game state:
  // Because gameLoop is calling state 60 times per second, it means play function will also run 60 times per second.
  state(delta);
}

//----------------------
// Play function
//----------------------
function play(delta) {
  // Move the farmer
  farmer.x += farmer.vx;
  farmer.y += farmer.vy;
}



function keyboard(keyCode) {
  const key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = (event) => {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) {
        key.press();
      }
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };

  //The `upHandler`
  key.upHandler = (event) => {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) {
        key.release();
      }
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  //Attach event listeners
  window.addEventListener("keydown", key.downHandler.bind(key), false);
  window.addEventListener("keyup", key.upHandler.bind(key), false);
  return key;
}