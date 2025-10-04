import { Container, Text, TextStyle, Graphics } from "pixi.js";

export default class PauseScreen {
  constructor(app, resumeFunction) {
    this.app = app;
    this.pauseScene = new Container();
    this.resumeFunction = resumeFunction;

    // Semi-transparent overlay
    const overlay = new Graphics();
    overlay.beginFill(0x000000);
    overlay.drawRect(0, 0, app.view.width, app.view.height);
    overlay.endFill();
    overlay.alpha = 0.7;
    this.pauseScene.addChild(overlay);

    // Paused text
    this.pausedText = new Text("PAUSED", {
      fontFamily: "Arial",
      fontSize: 72,
      fill: 0xFFFFFF,
      stroke: 0xFF6600,
      strokeThickness: 6,
      dropShadow: true,
      dropShadowColor: "#000000",
      dropShadowBlur: 8,
      dropShadowAngle: Math.PI / 4,
      dropShadowDistance: 8,
      align: "center",
    });
    this.pausedText.anchor.set(0.5);
    this.pausedText.x = app.screen.width / 2;
    this.pausedText.y = app.screen.height / 2 - 80;
    this.pauseScene.addChild(this.pausedText);

    // Instructions text
    this.instructionsText = new Text("Press ESC to Resume", {
      fontFamily: "Arial",
      fontSize: 28,
      fill: 0xFFFFFF,
      stroke: 0x000000,
      strokeThickness: 3,
      align: "center",
    });
    this.instructionsText.anchor.set(0.5);
    this.instructionsText.x = app.screen.width / 2;
    this.instructionsText.y = app.screen.height / 2 + 20;
    this.pauseScene.addChild(this.instructionsText);

    // Resume button
    this.resumeButton = new Text("RESUME");
    this.resumeButton.style = new TextStyle({
      fill: 0xFFFFFF,
      fontSize: 32,
      fontFamily: "Arial",
      align: "center",
      stroke: 0x000000,
      strokeThickness: 4,
    });
    this.resumeButton.x = app.screen.width / 2;
    this.resumeButton.y = app.screen.height / 2 + 80;
    this.resumeButton.anchor.set(0.5, 0.5);
    this.resumeButton.interactive = true;
    this.resumeButton.buttonMode = true;
    this.pauseScene.addChild(this.resumeButton);

    // Button hover effects
    this.resumeButton.on("pointerover", () => {
      this.resumeButton.style.fill = 0xFFD700;
      this.resumeButton.scale.set(1.1);
    });

    this.resumeButton.on("pointerout", () => {
      this.resumeButton.style.fill = 0xFFFFFF;
      this.resumeButton.scale.set(1.0);
    });

    this.resumeButton.on("pointerdown", () => {
      console.log("Resume Button Clicked");
      resumeFunction();
    });
  }
}
