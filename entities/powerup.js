import { Sprite, Graphics, Container, Text } from "pixi.js";

export class PowerUpCard extends Container {
  constructor(x, y) {
    super();

    // Create card background
    const cardBg = new Graphics();
    cardBg.beginFill(0xFFFFFF);
    cardBg.drawRoundedRect(-25, -35, 50, 70, 5);
    cardBg.endFill();
    this.addChild(cardBg);

    // Create card border
    const cardBorder = new Graphics();
    cardBorder.lineStyle(3, 0xFFD700);
    cardBorder.drawRoundedRect(-25, -35, 50, 70, 5);
    this.addChild(cardBorder);

    // Add "P" for Power-up
    const powerText = new Text("P", {
      fontFamily: "Arial",
      fontSize: 32,
      fill: 0xFF6600,
      fontWeight: "bold",
    });
    powerText.anchor.set(0.5);
    powerText.y = -10;
    this.addChild(powerText);

    // Add "UP" text
    const upText = new Text("UP", {
      fontFamily: "Arial",
      fontSize: 14,
      fill: 0xFF6600,
      fontWeight: "bold",
    });
    upText.anchor.set(0.5);
    upText.y = 15;
    this.addChild(upText);

    this.vx = 0;
    this.vy = 1; // Slow downward drift
    this.collected = false;

    // Floating animation
    this.floatOffset = 0;
    this.lastBob = 0;

    // Set initial screen position
    this.x = x;
    this.y = y;
  }

  update(delta, farmerDelta = { x: 0, y: 0 }) {
    // Slow downward drift
    this.y += this.vy;

    // Compensate for farmer movement (infinite scroll) - subtract to stay in world position
    this.x -= farmerDelta.x;
    this.y -= farmerDelta.y;

    // Floating bobbing animation
    this.floatOffset += 0.1 * delta;
    const bobAmount = Math.sin(this.floatOffset) * 5;
    this.y += bobAmount - this.lastBob;
    this.lastBob = bobAmount;

    // Gentle rotation
    this.rotation += 0.02 * delta;
  }
}
