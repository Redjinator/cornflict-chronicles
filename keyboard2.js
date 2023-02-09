export function keyboard2() {
    //Capture the keyboard arrow keys
    const left  = keyboard(37);
    const up    = keyboard(38);
    const right = keyboard(39);
    const down  = keyboard(40);

    //Left arrow key `press` method
    left.press = () => {
        //Change the farmer's velocity when the key is pressed
        farmer.vx = -5;
        farmer.vy = 0;
    };

    //Left arrow key `release` method
    left.release = () => {
        //If the left arrow has been released, and the right arrow isn't down,
        //and the farmer isn't moving vertically:
        //Stop the farmer
        if (!right.isDown && farmer.vy === 0) {
        farmer.vx = 0;
        }
    };

    //Up
    up.press = () => {
        farmer.vy = -5;
        farmer.vx = 0;
    };
    up.release = () => {
        if (!down.isDown && farmer.vx === 0) {
        farmer.vy = 0;
        }
    };

    //Right
    right.press = () => {
        farmer.vx = 5;
        farmer.vy = 0;
    };
    right.release = () => {
        if (!left.isDown && farmer.vy === 0) {
        farmer.vx = 0;
        }
    };

    //Down
    down.press = () => {
        farmer.vy = 5;
        farmer.vx = 0;
    };
    down.release = () => {
        if (!up.isDown && farmer.vx === 0) {
        farmer.vy = 0;
        }
    };
}