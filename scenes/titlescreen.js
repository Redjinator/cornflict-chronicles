import { Container, Text, Sprite, Loader, Graphics } from 'pixi.js';

export default class TitleScreen {
  constructor(app, startGame, id ) {
    this.titleScene = new Container();

    const titleImage = new Sprite(id["title.png"]);
    titleImage.anchor.set(0.5);
    titleImage.position.set(app.view.width / 2, app.view.height / 2);
    this.titleScene.addChild(titleImage);

    // #region Title Text
    const titleText = new Text('Cornflict Chronicles', {
      fontFamily: 'Arial',
      fontSize: 72,
      fill: "white",
      stroke: 'orange',
      strokeThickness: 4,
      dropShadow: true,
      dropShadowColor: "#000000",
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 5,
      wordWrap: true,
      wordWrapWidth: 900,
      align: 'center',
    });

    titleText.position.set(app.view.width / 3, app.view.height / 1.8);
    titleText.anchor.set(0.5, 0.5);
    this.titleScene.addChild(titleText);
    // #endregion

    // #region Start Button Text
    const startButton = new Text('START GAME', {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: "white",
      stroke: 'black',
      strokeThickness: 2,
      wordWrap: true,
      wordWrapWidth: 440,
      align: 'center',
    });
    startButton.anchor.set(0.5, 0.5);
    startButton.position.set(app.view.width / 2.2, app.view.height / 1.5);
    this.titleScene.addChild(startButton);
    // #endregion

    this.music = new Audio('/audio/CreepyFX_LongTransition.mp3');
    this.music.loop = false;
    this.music.play();

    startButton.interactive = true;
    startButton.buttonMode = true;

    startButton.on('pointerdown', () => {
      this.music.pause();
      this.titleScene.visible = false;
      startGame();
    });
  }
}
