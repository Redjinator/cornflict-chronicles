import { setSpriteProperties } from './spriteProperties.js';
import { randomSpawnPoint } from './spawnPoint.js';
import { Sprite } from 'pixi.js';

export function createEnemy(id) {
  const enemy = setSpriteProperties(new Sprite(id["enemy.png"]), 0.5, 0.5, 0, 0);
  enemy.scale.set(0.5, 0.5);
  enemy.anchor.set(0.5, 0.5);
  const r = randomSpawnPoint();
  enemy.x = r.x;
  enemy.y = r.y;
  return enemy;
}
