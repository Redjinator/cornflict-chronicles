import { Container, Text, Sprite, Loader, Graphics } from 'pixi.js';

export default class TitleScreen {
  constructor(app, stateTransition, nextState) {
    this.titleScene = new Container();
    this.stateTransition = stateTransition;
    this.nextState = nextState;

    // *Just a black background for now, will replace later with a cool title screen
    const blackBG = new Graphics();
    blackBG.beginFill(0x000000);
    blackBG.drawRect(0, 0, app.view.width, app.view.height);
    blackBG.endFill();
    this.titleScene.addChild(blackBG);

    const titleText = new Text('Cornflict Chronicles', {
      fontFamily: 'Arial',
      fontSize: 36,
      fill: 0xffffff,
      align: 'center',
    });
    titleText.position.set(app.view.width / 2, app.view.height / 4);
    titleText.anchor.set(0.5, 0.5);
    this.titleScene.addChild(titleText);

    const startButton = new Text('START GAME', {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 0xffffff,
      align: 'center',
    });
    startButton.anchor.set(0.5, 0.5);
    startButton.position.set(app.view.width / 2, app.view.height / 2);
    this.titleScene.addChild(startButton);

    this.music = new Audio('/audio/CreepyFX_LongTransition.mp3');
    this.music.loop = false;
    this.music.play();

    startButton.interactive = true;
    startButton.buttonMode = true;
    startButton.on('pointerdown', () => {
      let sound = new Audio('/audio/shot.mp3');
      //sound.play();
      this.music.pause();
      this.titleScene.visible = false;
      this.stateTransition(this.nextState);
    });
  }
}
