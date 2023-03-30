import { Container, Text, Sprite, Loader, Graphics } from 'pixi.js';
import { GodrayFilter } from "pixi-filters";

const godrayFilter = new GodrayFilter({
  parallel: true,
  lacunarity: 3,
  angle: 45,
  gain: 0.5,
  alpha: 1,
});
export default class TitleScreen {
  constructor(app, startGame, id, textTextures) {
    this.titleScene = new Container();

    const titleImage = new Sprite(id["title-image"]);
    titleImage.anchor.set(0.5);
    titleImage.scale.set(0.8);
    titleImage.position.set(app.view.width / 2, app.view.height / 2);
    this.titleScene.addChild(titleImage);


    const startButton = new PIXI.Sprite(textTextures["start-game-text-tiny-white"]);
    startButton.anchor.set(0.5);
    startButton.scale.set(0.7
  );
    startButton.position.set(150, app.view.height / 1.5);
    startButton.interactive = true;
    startButton.buttonMode = true;
    this.titleScene.addChild(startButton);

    this.titleScene.filters = [ godrayFilter ];

    app.ticker.add((delta) => {
      godrayFilter.time += 0.01 * delta;
    });


    this.music = new Audio('/audio/CreepyFX_LongTransition.mp3');
    this.music.loop = false;
    this.music.autoplay = false;



    startButton.on('pointerdown', () => {
      this.music.pause();
      this.titleScene.visible = false;
      startGame();
    });
  }
}


