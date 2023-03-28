import { shoot } from "../entities/shoot.js";

export function autoFire(farmer, forks, gameScene, active, interval) {

  if (active) {
    setInterval(() => {
      shoot(farmer, forks, gameScene);
    }, interval); // fire every half second
  }
}