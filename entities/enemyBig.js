import * as PIXI from "pixi.js";
import Victor from "victor";
import { getTexture } from "../helpers/textureUtils";

class EnemyBig extends PIXI.Sprite {
  constructor(texture, speed, movementStrategy) {
    super(texture);

    // Store enemy type and speed
    this.type = texture.textureCacheIds[0];
    this.speed = speed;

    // Set anchor and scale
    this.anchor.set(0.5);
    this.scale.set(0.2);

    // Set initial position
    this.position.set(0, 0);

    // Store the movement strategy
    this.movementStrategy = movementStrategy;
  }

  move(farmer, farmerDelta) {
    this.movementStrategy.move(this, farmer, farmerDelta);
  }
}

function createEnemyBig(resources, movementStrategy) {
  console.log("Resources:", resources); // Log the resources object

  const enemy = "ecorn_yellow"; // Use a single texture key for EnemyBig
  const enemyTexture = getTexture(
    resources,
    "images/ecorns-spritesheet.json",
    enemy
  );

  const enemySpeed = 2; // Set the desired speed for the enemy
  const newEnemy = new EnemyBig(enemyTexture, enemySpeed, movementStrategy);
  console.log("Created a big enemy:", newEnemy.x, newEnemy.y);

  return newEnemy;
}

class ChasePlayerStrategy {
  move(enemy, farmer, farmerDelta) {
    let e = new Victor(enemy.x, enemy.y);
    let f = new Victor(farmer.x, farmer.y);
    let d = f.subtract(e);
    let v = d.normalize().multiplyScalar(enemy.speed);
    enemy.position.set(
      enemy.position.x + v.x - farmerDelta.x,
      enemy.position.y + v.y - farmerDelta.y
    );
  }
}

export { EnemyBig, createEnemyBig, ChasePlayerStrategy };
