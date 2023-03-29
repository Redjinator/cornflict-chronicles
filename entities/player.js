import { setupKeyboard } from './keyboardMovement.js';
import { Sprite } from 'pixi.js';
import { DropShadowFilter } from 'pixi-filters';

export function createPlayer(runFarmer) {
    let player = runFarmer;
    player.scale.set(0.2);
    player.anchor.set(0.4, 0.5);
    player.position.set(640, 360);

    player.vx = 0;
    player.vy = 0;
    player.runFarmer = runFarmer;
    player = setupKeyboard(player);
    player.filters = [dropShadowFilter];
    return player;
}


const dropShadowFilter = new DropShadowFilter({
    distance: 8,
    blur: 4,
    color: 0x000000,
    alpha: 0.8,
});