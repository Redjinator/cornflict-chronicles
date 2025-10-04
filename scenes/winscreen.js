import { Container, Text, TextStyle, Sprite, Graphics } from "pixi.js";
import { GodrayFilter } from "pixi-filters";

export default class WinScreen {
  constructor(app, finalScore, restartFunction, screenTextures, textTextures, isNewHighScore = false) {
    this.app = app;
    this.winScene = new Container();
    this.finalScore = finalScore;
    this.restartFunction = restartFunction;
    this.isNewHighScore = isNewHighScore;

    // Create sunrise background overlay
    const sunriseOverlay = new Graphics();
    sunriseOverlay.beginFill(0xFFAA33);
    sunriseOverlay.drawRect(0, 0, app.view.width, app.view.height);
    sunriseOverlay.endFill();
    sunriseOverlay.alpha = 0.3;
    this.winScene.addChild(sunriseOverlay);

    // Victory text
    this.victoryText = new Text("VICTORY!", {
      fontFamily: "Arial",
      fontSize: 72,
      fill: 0xFFD700,
      stroke: 0xFF6600,
      strokeThickness: 6,
      dropShadow: true,
      dropShadowColor: "#000000",
      dropShadowBlur: 8,
      dropShadowAngle: Math.PI / 4,
      dropShadowDistance: 8,
      align: "center",
    });
    this.victoryText.anchor.set(0.5);
    this.victoryText.x = app.screen.width / 2;
    this.victoryText.y = app.screen.height / 2 - 150;
    this.winScene.addChild(this.victoryText);

    // Survived text
    this.survivedText = new Text("You survived until sunrise!", {
      fontFamily: "Arial",
      fontSize: 32,
      fill: 0xFFFFFF,
      stroke: 0x000000,
      strokeThickness: 4,
      align: "center",
    });
    this.survivedText.anchor.set(0.5);
    this.survivedText.x = app.screen.width / 2;
    this.survivedText.y = app.screen.height / 2 - 80;
    this.winScene.addChild(this.survivedText);

    // Display Score Text
    this.finalScoreText = new Text(`Final Score: ${this.finalScore}`, {
      fontFamily: "Arial",
      fontSize: 36,
      fill: 0xFFFFFF,
      stroke: 0xFF6600,
      strokeThickness: 4,
      align: "center",
    });
    this.finalScoreText.anchor.set(0.5);
    this.finalScoreText.x = app.screen.width / 2;
    this.finalScoreText.y = app.screen.height / 2;
    this.winScene.addChild(this.finalScoreText);

    // New High Score Text
    if (this.isNewHighScore) {
      this.newHighScoreText = new Text("NEW HIGH SCORE!", {
        fontFamily: "Arial",
        fontSize: 28,
        fill: 0xFFD700,
        stroke: 0xFF0000,
        strokeThickness: 4,
        align: "center",
      });
      this.newHighScoreText.anchor.set(0.5);
      this.newHighScoreText.x = app.screen.width / 2;
      this.newHighScoreText.y = app.screen.height / 2 + 40;
      this.winScene.addChild(this.newHighScoreText);
    }

    // Play Again Button
    this.playAgainButton = new Text("PLAY AGAIN");
    this.playAgainButton.style = new TextStyle({
      fill: 0xFFFFFF,
      fontSize: 28,
      fontFamily: "Arial",
      align: "center",
      stroke: 0x000000,
      strokeThickness: 3,
    });
    this.playAgainButton.x = app.screen.width / 2;
    this.playAgainButton.y = this.isNewHighScore ? app.screen.height / 2 + 110 : app.screen.height / 2 + 80;
    this.playAgainButton.anchor.set(0.5, 0.5);
    this.playAgainButton.interactive = true;
    this.playAgainButton.buttonMode = true;
    this.winScene.addChild(this.playAgainButton);

    // Add godray filter for sunrise effect
    const godrayFilter = new GodrayFilter({
      parallel: false,
      lacunarity: 2.5,
      angle: 90,
      gain: 0.6,
      alpha: 0.8,
    });
    this.winScene.filters = [godrayFilter];

    app.ticker.add((delta) => {
      godrayFilter.time += 0.005 * delta;
    });

    // Button hover effects
    this.playAgainButton.on("pointerover", () => {
      this.playAgainButton.style.fill = 0xFFD700;
      this.playAgainButton.scale.set(1.1);
    });

    this.playAgainButton.on("pointerout", () => {
      this.playAgainButton.style.fill = 0xFFFFFF;
      this.playAgainButton.scale.set(1.0);
    });

    this.playAgainButton.on("pointerdown", () => {
      console.log("Play Again Button Clicked");
      this.app.stage.removeChild(this.winScene);
      restartFunction();
    });

    // Victory sound
    this.victorySound = new Audio("/audio/yippee.mp3");
    this.victorySound.volume = 0.7;
    this.victorySound.play();
  }
}
