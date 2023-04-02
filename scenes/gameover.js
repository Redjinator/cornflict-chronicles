import { Container, Text, TextStyle, Sprite } from "pixi.js";

export default class GameOver {
  constructor(app, scoreboard, restartFunction, id) {
    this.app = app;
    this.gameOverScene = new Container();
    this.scoreboard = scoreboard;
    this.restartFunction = restartFunction;

    const gameOverImage = new Sprite(id["gameover-image"]);
    gameOverImage.anchor.set(0.5);
    gameOverImage.scale.set(0.8);
    gameOverImage.position.set(app.view.width / 2, app.view.height / 2);
    this.gameOverScene.addChild(gameOverImage);

    // Display Score Text
    this.finalScoreText = new PIXI.Text(`Final Score ${this.scoreboard}`, {
      fontFamily: "Arial",
      fontSize: 24,
      fill: 0xffffff,
      align: "center",
    });

    this.finalScoreText.anchor.set(0.5);
    this.finalScoreText.x = this.app.screen.width / 2;
    this.finalScoreText.y = this.app.screen.height / 2 - 50;
    this.gameOverScene.addChild(this.finalScoreText);

    // * Start Game Button Text
    // *=================================================
    this.restartButton = new Text("RESTART");
    this.restartButton.style = new TextStyle({
      fill: 0xffffff,
      fontSize: 24,
      fontFamily: "Arial",
      align: "center",
    });
    this.restartButton.x = this.app.screen.width / 2;
    this.restartButton.y = this.app.screen.height / 2;
    this.restartButton.anchor.set(0.5, 0.5);
    this.gameOverScene.addChild(this.restartButton);

    // Listener for start button
    this.restartButton.interactive = true;
    this.restartButton.buttonMode = true;

    this.restartButton.on("pointerdown", () => {
      console.log("Restart Button Clicked");
      this.app.stage.removeChild(this.gameOverScene);
      restartFunction();
    });
  }
}
