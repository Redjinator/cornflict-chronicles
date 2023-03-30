import { TilingSprite } from 'pixi.js';

export function createBackground(texture, app) {
  let tiling = new TilingSprite(texture, app.view.width, app.view.height);
  tiling.position.set(0, 0);
  return tiling;
}