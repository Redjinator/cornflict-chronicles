import { Sprite } from 'pixi.js';
export class Enemy extends Sprite {
  constructor(id, speed) {
    let enemy = Math.random() > 0.5 ? 'ecorn' : 'ecorn_lit';
    super(id[enemy])
    this.scale.set(0.1);
    this.anchor.set(0.5);
    this.position.set(0, 0);
    this.vx = 0;
    this.vy = 0;
    this.speed = Math.random() * speed;
  }
}