import { setupKeyboard } from './keyboardMovement.js';

export function createPlayer(idle) {
    let player = idle;
    player.scale.set(0.2);
    player.anchor.set(0.4, 0.5);
    player.position.set(640, 360);

    player.vx = 0;
    player.vy = 0;
    player = setupKeyboard(player);

    return player;
}


