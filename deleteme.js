//import './style.css'









/*
Where was I?

I just got multiple bullets to work using arrays.

Next: enemies and collsions
Then: score and health
Then: levels and waves
Then: enemy movement
Then: game over and restart
Then: game win
Then: high score screen
Then: main menu
*/



import { keyboard } from './keyboard.js'
import './myfunctions.js'
import { setSpriteProperties, loadProgressHandler, fire } from './myfunctions.js';
import { Container, TextStyle } from 'pixi.js';
import { hitTestRectangle } from './collisions.js';

const Application = PIXI.Application,
  loader = PIXI.Loader.shared,
  TextureCache = PIXI.utils.TextureCache,
  resources = PIXI.Loader.shared.resources,
  Text = PIXI.Text,
  Sprite = PIXI.Sprite;

const app = new Application({
  width: 1280,
  height: 720,
  antialias: true,
  transparent: false,
  resolution: 1
});

document.body.appendChild(app.view);
app.renderer.backgroundColor = 0x061639;

const { width, height } = app.view;
let gameScene, farmer, enemy, fieldbg, bullet, id, state, score;
let bullets = [];

let bulletLimit =10;

/* #region loader */
// ----------------------
loader.onProgress.add(loadProgressHandler);

loader
  .add('images/mvp-spritesheet.json')
  .load(setup);
/* #endregion */

/* #region Setup */
function setup() {
  score = 0;
  gameScene = new Container();

  // Alias called id for all the texture atlas frame id textures
  id = resources["images/mvp-spritesheet.json"].textures;
  fieldbg = setSpriteProperties(new Sprite(id["field-bg.png"]), 1, 1, 1280, 720);
  farmer  = setSpriteProperties(new Sprite(id["farmer-v3.png"]), 0.5, 0.2, 640, 600);
  enemy   = setSpriteProperties(new Sprite(id["enemy-small.png"]), 0.5, 0.5, 400, 100);

  gameScene.addChild(fieldbg);
  gameScene.addChild(farmer);
  app.stage.addChild(gameScene);

  const left = keyboard(37),
        up = keyboard(38),
        right = keyboard(39),
        down = keyboard(40);
  left.press = () => {farmer.vx = -5; farmer.vy = 0;};
  left.release = () => { if (!right.isDown && farmer.vy === 0) { farmer.vx = 0; }};
  up.press = () => {farmer.vy = -5; farmer.vx = 0;};
  up.release = () => { if (!down.isDown && farmer.vx === 0) { farmer.vy = 0; }};
  right.press = () => {farmer.vx = 5; farmer.vy = 0;};
  right.release = () => { if (!left.isDown && farmer.vy === 0) { farmer.vx = 0; }};
  down.press = () => {farmer.vy = 5; farmer.vx = 0;};
  down.release = () => { if (!up.isDown && farmer.vx === 0) { farmer.vy = 0; }};

  const scoreboard = new Text("Score:" + score, scoreBoardStyle);
  scoreboard.anchor.set(0.5, 0.5);
  scoreboard.position.set(gameScene.width / 2, 100);
  gameScene.addChild(scoreboard);

  const mouseTarget = app.stage.addChild(new PIXI.Graphics().beginFill(0xffffff).lineStyle({color: 0x111111, alpha: 0.5, width: 1}).drawCircle(0,0,8).endFill());
  mouseTarget.position.set(app.screen.width / 2, app.screen.height / 2);
  app.stage.interactive = true;

  app.stage.on('pointermove', (event) => {
    mouseTarget.position.set(event.data.global.x, event.data.global.y);
    farmer.rotation = Math.atan2(mouseTarget.y - farmer.y, mouseTarget.x - farmer.x);});

const sound = new Audio("/audio/shot.mp3");

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
      }}});

  state = play;
  app.ticker.add(delta => gameLoop(delta));

}

function gameLoop(delta) {
  state(delta);
}

function play(delta) {
  farmer.x += farmer.vx;
  farmer.y += farmer.vy;
  for (let i=0; i<bullets.length; i++) {
    let bullet = bullets[i];
    if (bullet.parent) {
        bullet.x += bullet.vx;
        bullet.y += bullet.vy;
        if (bullet.x < 0 || bullet.x > app.screen.width || bullet.y < 0 || bullet.y > app.screen.height) {
            gameScene.removeChild(bullet);
        }}}}

function end() {
  console.log("Game Over");
}

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
