export default class Enemy extends PIXI.Sprite {
    constructor(texture, speed, farmer, bgBackground) {
      super(texture);
      this.anchor.set(0.5);
      this.scale.set(0.1);
      this.speed = speed;
      this.farmer = farmer;
      this.bgBackground = bgBackground;
    }
  
    moveTowards(target, delta) {
      const e = new Victor(this.x, this.y);
      const t = new Victor(target.x, target.y);
      const d = t.subtract(e);
      const v = d.normalize().multiplyScalar(this.speed);
      this.position.set(this.position.x + v.x - delta.x, this.position.y + v.y - delta.y);
  
      // Adjust for infinite scrolling background
      const bgDelta = {
        x: this.bgBackground.tilePosition.x - this.bgBackground.position.x,
        y: this.bgBackground.tilePosition.y - this.bgBackground.position.y
      };
      this.position.set(this.position.x - bgDelta.x, this.position.y - bgDelta.y);
    }
  }