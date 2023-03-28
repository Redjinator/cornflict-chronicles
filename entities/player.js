import { setSpriteProperties } from '../helpers/spriteProperties.js';
import { setupKeyboard } from './keyboardMovement.js';
import { Sprite } from 'pixi.js';

export function createPlayer(id) {
    const player = setSpriteProperties(new Sprite(id["farmer-east"]), 0.5, 0.2, 640, 360);
    player.zIndex = 2;
    return setupKeyboard(player);
}
