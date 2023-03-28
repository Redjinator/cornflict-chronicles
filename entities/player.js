import { setSpriteProperties } from '../helpers/spriteProperties.js';
import { setupKeyboard } from './keyboardMovement.js';
import { Sprite } from 'pixi.js';

export function createPlayer(id) {
    const player = new PIXI.Sprite(id.textures["farmer-idle-01"]);
    player.scale.set(0.01);
        //setSpriteProperties(new Sprite(id["farmer-east"]), 0.5, 0.2, 640, 360);
    return setupKeyboard(player);
}
