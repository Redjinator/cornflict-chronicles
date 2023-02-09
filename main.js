import './style.css'

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






// Define my variables
let farmer, enemy, fieldbg, bullet, id;



// use loader
// ----------------------
loader.onProgress.add(loadProgressHandler);

loader
  .add('images/mvp-spritesheet.json')
  .load(setup);



// Setup function
//----------------------
function setup() {


  // This code will run, when the loader finishes loading the images
  console.log("All files loaded");

  // Alias called id for all the texture atlas frame id textures
  id = resources["images/mvp-spritesheet.json"].textures;

  // Create the sprites
  const fieldbg = setSpriteProperties(new Sprite(id["field-bg.png"]), 1, 1, 1280, 720);
  const farmer = setSpriteProperties(new Sprite(id["farmer-v3.png"]), 0.5, 0.2, 400, 100);

  // Add the sprites to the stage
  app.stage.addChild(fieldbg);
  app.stage.addChild(farmer);
}




