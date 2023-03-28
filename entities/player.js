import { setSpriteProperties } from '../helpers/spriteProperties.js';
import { setupKeyboard } from './keyboardMovement.js';
import { Sprite } from 'pixi.js';

export default function createPlayer(idle) {
    const player = setSpriteProperties(idle, 0.5, 0.2, 640, 360);
    player.scale.set(0.1);

    return setupKeyboard(player);
}
