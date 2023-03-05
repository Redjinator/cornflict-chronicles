import { setSpriteProperties } from './spriteProperties.js';
import { setupKeyboard } from './keyboardMovement.js';
import { Sprite } from 'pixi.js';

export function createPlayer(id) {
    const player = setSpriteProperties(new Sprite(id["farmer-v3.png"]), 0.5, 0.2, 640, 360);
    return setupKeyboard(player);
}
