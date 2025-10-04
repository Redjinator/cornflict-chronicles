// Weapon system with 5 levels of power
export class WeaponSystem {
  constructor() {
    this.level = 1;
    this.maxLevel = 5;
  }

  powerUp() {
    if (this.level < this.maxLevel) {
      this.level++;
      return true; // Successfully powered up
    }
    return false; // Already at max
  }

  reset() {
    this.level = 1;
  }

  getLevel() {
    return this.level;
  }

  // Get shot pattern based on weapon level
  getShotPattern(farmer) {
    const { x, y, rotation } = farmer;
    const speed = 25;
    const shots = [];

    switch (this.level) {
      case 1:
        // Level 1: Single shot
        shots.push({
          x: x,
          y: y,
          rotation: rotation,
          vx: Math.cos(rotation) * speed,
          vy: Math.sin(rotation) * speed,
        });
        break;

      case 2:
        // Level 2: Double shot (slight spread)
        const spread2 = 0.1;
        shots.push({
          x: x,
          y: y,
          rotation: rotation,
          vx: Math.cos(rotation - spread2) * speed,
          vy: Math.sin(rotation - spread2) * speed,
        });
        shots.push({
          x: x,
          y: y,
          rotation: rotation,
          vx: Math.cos(rotation + spread2) * speed,
          vy: Math.sin(rotation + spread2) * speed,
        });
        break;

      case 3:
        // Level 3: Triple shot (wider spread)
        const spread3 = 0.15;
        shots.push({
          x: x,
          y: y,
          rotation: rotation,
          vx: Math.cos(rotation - spread3) * speed,
          vy: Math.sin(rotation - spread3) * speed,
        });
        shots.push({
          x: x,
          y: y,
          rotation: rotation,
          vx: Math.cos(rotation) * speed,
          vy: Math.sin(rotation) * speed,
        });
        shots.push({
          x: x,
          y: y,
          rotation: rotation,
          vx: Math.cos(rotation + spread3) * speed,
          vy: Math.sin(rotation + spread3) * speed,
        });
        break;

      case 4:
        // Level 4: Quad shot (even wider)
        const spread4 = 0.2;
        for (let i = -1.5; i <= 1.5; i++) {
          shots.push({
            x: x,
            y: y,
            rotation: rotation,
            vx: Math.cos(rotation + i * spread4) * speed,
            vy: Math.sin(rotation + i * spread4) * speed,
          });
        }
        break;

      case 5:
        // Level 5: Five-way spread (maximum power!)
        const spread5 = 0.25;
        for (let i = -2; i <= 2; i++) {
          shots.push({
            x: x,
            y: y,
            rotation: rotation,
            vx: Math.cos(rotation + i * spread5) * speed,
            vy: Math.sin(rotation + i * spread5) * speed,
          });
        }
        break;
    }

    return shots;
  }
}
