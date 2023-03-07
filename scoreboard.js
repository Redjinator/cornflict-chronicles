import { Text, TextStyle } from 'pixi.js';

export default class Scoreboard {
    constructor() {
        this.score = 0;
        this.scoreboard = new Text("Score: " + this.score, scoreBoardStyle);
        this.scoreboard.anchor.set(0.5, 0.5);
        this.scoreboard.position.set(1280 / 2, 48);
    }

    increaseScore() {
        this.score += 1;
        this.scoreboard.text = "Score: " + this.score;
    }

    getScore() {
        return this.scoreboard;
    }

    resetScore() {
        this.score = 0;
        this.scoreboard.text = "Score: " + this.score;
    }
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