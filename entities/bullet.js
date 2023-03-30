import { Sprite } from "pixi.js";
import { setSpriteProperties } from "../helpers/spriteProperties";

export function createBullet(id) {
  let bullet = setSpriteProperties(new Sprite(id["bullet"]), 0.5, 0.03, 0, 0);

  bullet.anchor.set(0.5, 0.5);
  bullet.rotation = 0.5;
  bullet.zIndex = 0.5;
  bullet.vx = 0;
  bullet.vy = 0;
  return bullet;
}
