import { Sprite } from "pixi.js";
import { DropShadowFilter, GlowFilter } from "pixi-filters";
export class Enemy extends Sprite {
  constructor(id, speed) {
    let enemy = Math.random() > 0.5 ? "ecorn" : "ecorn_lit";
    super(id[enemy]);
    this.scale.set(0.1);
    this.anchor.set(0.5);
    this.position.set(0, 0);
    this.vx = 0;
    this.vy = 0;
    this.speed = Math.random() * speed;
    this.filters = [dropShadowFilter, glowFilter];

  }
}

const dropShadowFilter = new DropShadowFilter({
  distance: 8,
  blur: 4,
  color: 0x000000,
  alpha: 0.8,
});

const glowFilter = new GlowFilter({
  distance: 1,
  outerStrength: 2,
  innerStrength: 0,
  color: 0x05e648,
});
