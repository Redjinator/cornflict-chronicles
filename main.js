import './style.css'

// Alias
const Application = PIXI.Application,
  loader = PIXI.Loader.shared,
  resources = PIXI.Loader.shared.resources,
  Sprite = PIXI.Sprite;


/// Pixi App
const app = new Application({
  width: 256,
  height: 256,
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

// Change the size of the canvas, set AutoDensity to true to make sure it matches the screen
app.renderer.resize(1280, 720);

// use loader
loader
  .add('farmer-v3.png')
  .add('enemy.png')
  .add('bullet.png')
  .add('field-bg.png')
  .load(setup);

// Setup function
function setup() {
  // This code will run, when the loader finishes loading the images
  const farmer = new Sprite(resources['farmer-v3.png'].texture);
}




