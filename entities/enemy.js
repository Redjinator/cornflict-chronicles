import { setSpriteProperties } from '../helpers/spriteProperties.js';
import { Sprite } from 'pixi.js';

export class Enemy extends Sprite {
  constructor(id, speed, farmer, heartsContainer, gameScene) {
    super(id['ecorn.png']);
    setSpriteProperties(this, 0.5, 0.5, 0, 0);
    this.scale.set(0.1);
    this.anchor.set(0.5);

    this.speed = Math.random() * speed;
    this.farmer = farmer;
    this.heartsContainer = heartsContainer;
    this.gameScene = gameScene;
  }
}