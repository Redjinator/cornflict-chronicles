import { setSpriteProperties } from './spriteProperties.js';
import { Sprite } from 'pixi.js';
import Victor from 'victor';
import { hitTestRectangle } from './collisions.js';

export class Enemy extends Sprite {
  constructor(id, speed, farmer, heartsContainer, gameScene) {
    super(id['enemy.png']);
    setSpriteProperties(this, 0.5, 0.5, 0, 0);
    this.scale.set(0.5);
    this.anchor.set(0.5);

    this.speed = speed;
    this.farmer = farmer;
    this.heartsContainer = heartsContainer;
    this.gameScene = gameScene;
  }

  update(farmerDeltaX, farmerDeltaY) {
    let e = new Victor(this.x, this.y);
    let f = new Victor(this.farmer.x, this.farmer.y);
    let d = f.subtract(e);
    let v = d.normalize().multiplyScalar(this.speed);
    this.position.set(this.position.x + v.x - farmerDeltaX, this.position.y + v.y - farmerDeltaY);

    if (hitTestRectangle(this.farmer, this)) {
      this.gameScene.removeChild(this);
      let index = this.heartsContainer.children.length - 1;
      if (index >= 0) {
        this.heartsContainer.removeChildAt(index);
      }
      return true; // indicate that the enemy was hit, not sure if this is clear enough
    }
    return false;
  }
}