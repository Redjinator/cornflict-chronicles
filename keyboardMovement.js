
export function setupKeyboard(player) {

    const left  = keyboard(65),
          up    = keyboard(87),
          right = keyboard(68),
          down  = keyboard(83);

    //Left arrow key `press` method
    left.press = () => {
    if (up.isDown) {
    player.vx = -5;
    player.vy = -5;
    } else if (down.isDown) {
    player.vx = -5;
    player.vy = 5;
    } else {
    player.vx = -5;
    player.vy = 0;
    }
    };

    left.release = () => {
    if (!right.isDown && !up.isDown && !down.isDown) {
    player.vx = 0;
    player.vy = 0;
    } else if (right.isDown) {
    player.vx = 5;
    player.vy = 0;
    } else if (up.isDown) {
    player.vx = 0;
    player.vy = -5;
    } else if (down.isDown) {
    player.vx = 0;
    player.vy = 5;
    }
    };

    //Up
    up.press = () => {
    if (left.isDown) {
    player.vx = -5;
    player.vy = -5;
    } else if (right.isDown) {
    player.vx = 5;
    player.vy = -5;
    } else {
    player.vx = 0;
    player.vy = -5;
    }
    };

    up.release = () => {
    if (!down.isDown && !left.isDown && !right.isDown) {
    player.vx = 0;
    player.vy = 0;
    } else if (right.isDown) {
    player.vx = 5;
    player.vy = 0;
    } else if (left.isDown) {
    player.vx = -5;
    player.vy = 0;
    } else if (down.isDown) {
    player.vx = 0;
    player.vy = 5;
    }
    };

    //Right
    right.press = () => {
    if (up.isDown) {
    player.vx = 5;
    player.vy = -5;
    } else if (down.isDown) {
    player.vx = 5;
    player.vy = 5;
    } else {
    player.vx = 5;
    player.vy = 0;
    }
    };

    right.release = () => {
    if (!left.isDown && !up.isDown && !down.isDown) {
    player.vx = 0;
    player.vy = 0;
    } else if (left.isDown) {
    player.vx = -5;
    player.vy = 0;
    } else if (up.isDown) {
    player.vx = 0;
    player.vy = -5;
    } else if (down.isDown) {
    player.vx = 0;
    player.vy = 5;
    }
    };

    //Down
    down.press = () => {
    if (left.isDown) {
    player.vx = -5;
    player.vy = 5;
    } else if (right.isDown) {
    player.vx = 5;
    player.vy = 5;
    } else {
    player.vx = 0;
    player.vy = 5;
    }
    };

    down.release = () => {
    if (!up.isDown && !left.isDown && !right.isDown) {
    player.vx = 0;
    player.vy = 0;
    } else if (right.isDown) {
    player.vx = 5;
    player.vy = 0;
    } else if (left.isDown) {
    player.vx = -5;
    player.vy = 0;
    } else if (up.isDown) {
    player.vx = 0;
    player.vy = -5;
    }
    };

    return player;
}

function keyboard(keyCode) {
    const key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = (event) => {
      if (event.keyCode === key.code) {
        if (key.isUp && key.press) {
          key.press();
        }
        key.isDown = true;
        key.isUp = false;
      }
      event.preventDefault();
    };

    //The `upHandler`
    key.upHandler = (event) => {
      if (event.keyCode === key.code) {
        if (key.isDown && key.release) {
          key.release();
        }
        key.isDown = false;
        key.isUp = true;
      }
      event.preventDefault();
    };

    //Attach event listeners
    window.addEventListener("keydown", key.downHandler.bind(key), false);
    window.addEventListener("keyup", key.upHandler.bind(key), false);
    return key;
  }