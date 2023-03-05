import { Container, Text, TextStyle } from 'pixi.js';

export default class GameOver {
  constructor(app) {
    this.app = app;
    this.gameOverScene = new Container();



    // * Start Game Button Text
    // *=================================================
    this.restartButton = new Text("RESTART");
    this.restartButton.style = new TextStyle({
      fill: 0xFFFFFF,
      fontSize: 24,
      fontFamily: "Arial",
      align: "center"
    });
    this.restartButton.x = this.app.screen.width / 2;
    this.restartButton.y = this.app.screen.height / 2;
    this.restartButton.anchor.set(0.5, 0.5);
    this.gameOverScene.addChild(this.restartButton);

    // Listener for start button
    this.restartButton.interactive = true;
    this.restartButton.buttonMode = true;

    this.restartButton.on('pointerdown', () => {
      console.log("Restart Button Clicked");
    });

  }


}
