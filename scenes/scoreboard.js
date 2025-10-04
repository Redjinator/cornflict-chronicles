import { Text, TextStyle, Container } from "pixi.js";
import { HighScoreManager } from "../helpers/highscore.js";

export default class Scoreboard {
  constructor() {
    this.score = 0;
    this.highScoreManager = new HighScoreManager();
    this.container = new Container();

    this.scoreboard = new Text("Score: " + this.score, scoreBoardStyle);
    this.scoreboard.anchor.set(0.5, 0.5);
    this.scoreboard.position.set(1280 / 2, 48);
    this.container.addChild(this.scoreboard);

    // High score display
    this.highScoreText = new Text("High Score: " + this.highScoreManager.getHighScore(), highScoreBoardStyle);
    this.highScoreText.anchor.set(0.5, 0.5);
    this.highScoreText.position.set(1280 / 2, 90);
    this.container.addChild(this.highScoreText);
  }

  increaseScore() {
    this.score += 1;
    this.scoreboard.text = "Score: " + this.score;
  }

  getScore() {
    return this.score;
  }

  getContainer() {
    return this.container;
  }

  resetScore() {
    this.score = 0;
    this.scoreboard.text = "Score: " + this.score;
  }

  updateHighScore() {
    const isNewHigh = this.highScoreManager.setHighScore(this.score);
    this.highScoreText.text = "High Score: " + this.highScoreManager.getHighScore();
    return isNewHigh;
  }
}

const scoreBoardStyle = new TextStyle({
  fontFamily: "Arial",
  fontSize: 36,
  fill: "white",
  stroke: "orange",
  strokeThickness: 4,
  dropShadow: true,
  dropShadowColor: "#000000",
  dropShadowBlur: 4,
  dropShadowAngle: Math.PI / 6,
  dropShadowDistance: 6,
  wordWrap: true,
  wordWrapWidth: 440,
});

const highScoreBoardStyle = new TextStyle({
  fontFamily: "Arial",
  fontSize: 24,
  fill: "#FFD700",
  stroke: "#FF6600",
  strokeThickness: 3,
  dropShadow: true,
  dropShadowColor: "#000000",
  dropShadowBlur: 4,
  dropShadowAngle: Math.PI / 6,
  dropShadowDistance: 4,
  wordWrap: true,
  wordWrapWidth: 440,
});
