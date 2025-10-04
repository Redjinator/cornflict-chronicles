import { Container, Text, TextStyle, Sprite } from "pixi.js";

export default class GameOver {
  constructor(app, finalScore, restartFunction, id, isNewHighScore = false) {
    this.app = app;
    this.gameOverScene = new Container();
    this.finalScore = finalScore;
    this.restartFunction = restartFunction;
    this.isNewHighScore = isNewHighScore;

    const gameOverImage = new Sprite(id["gameover-image"]);
    gameOverImage.anchor.set(0.5);
    gameOverImage.scale.set(0.8);
    gameOverImage.position.set(app.view.width / 2, app.view.height / 2);
    this.gameOverScene.addChild(gameOverImage);

    // Display Score Text
    this.finalScoreText = new PIXI.Text(`Final Score: ${this.finalScore}`, {
      fontFamily: "Arial",
      fontSize: 28,
      fill: 0xffffff,
      stroke: 0x000000,
      strokeThickness: 3,
      align: "center",
    });

    this.finalScoreText.anchor.set(0.5);
    this.finalScoreText.x = this.app.screen.width / 2;
    this.finalScoreText.y = this.app.screen.height / 2 - 50;
    this.gameOverScene.addChild(this.finalScoreText);

    // New High Score Text
    if (this.isNewHighScore) {
      this.newHighScoreText = new Text("NEW HIGH SCORE!", {
        fontFamily: "Arial",
        fontSize: 24,
        fill: 0xFFD700,
        stroke: 0xFF0000,
        strokeThickness: 3,
        align: "center",
      });
      this.newHighScoreText.anchor.set(0.5);
      this.newHighScoreText.x = this.app.screen.width / 2;
      this.newHighScoreText.y = this.app.screen.height / 2 - 10;
      this.gameOverScene.addChild(this.newHighScoreText);
    }

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
    this.restartButton.y = this.isNewHighScore ? this.app.screen.height / 2 + 40 : this.app.screen.height / 2;
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
