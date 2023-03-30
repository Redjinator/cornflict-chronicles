import { Sprite } from "pixi.js";
import { DropShadowFilter } from "pixi-filters";
export class Enemy extends Sprite {
  constructor(id, speed) {
    let randomNumber = Math.random();

    let enemy;
    if (randomNumber < 0.25) {
      enemy = "ecorn_bluesm";
    } else if (randomNumber > 0.25 && randomNumber < 0.5) {
      enemy = "ecorn_yellow";
    } else if (randomNumber > 0.5 && randomNumber < 0.75) {
      enemy = "ecorn_redsm";
    } else {
      enemy = "ecorn_limesm";
    }

    


    super(id[enemy]);
    this.scale.set(0.2);
    this.anchor.set(0.5);
    this.position.set(0, 0);
    this.vx = 0;
    this.vy = 0;
    this.speed = Math.random() * speed;
    this.filters = [dropShadowFilter];
    this.name = enemy;

  }
}

const dropShadowFilter = new DropShadowFilter({
  distance: 8,
  blur: 4,
  color: 0x000000,
  alpha: 0.8,
});


