import { Sprite } from "pixi.js";
import { DropShadowFilter } from "pixi-filters";

function selectEnemy(selection) {
  switch (selection) {
    case 3:
      return "ecorn_bluesm";
    case 2:
      return "ecorn_limesm";
    case 1:
      return "ecorn_yellow";
    default:
      return "ecorn_redsm";
  }
}

export class Enemy extends Sprite {
  constructor(id, selection) {
    const enemyName = selectEnemy(selection);
    super(id[enemyName]);

    this.scale.set(0.2);
    this.anchor.set(0.5);
    this.position.set(0, 0);
    this.vx = 0;
    this.vy = 0;
    this.speed = 1;
    this.filters = [new DropShadowFilter({
      distance: 8,
      blur: 4,
      color: 0x000000,
      alpha: 0.8,
    })];
    this.name = enemyName;
  }
}
