import { Sprite } from 'pixi.js';

export function createBullet(id) {
  let bullet = new Sprite(id["bullet.png"]);
  bullet.anchor.set(0.5, 0.5);
  bullet.vx = 0;
  bullet.vy = 0;
  return bullet;
}