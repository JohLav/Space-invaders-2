import { Drawable } from './Drawable.js';

export class InvaderProjectile extends Drawable {
  constructor(x, y, directionX, directionY) {
    super(
      x,
      y,
      directionX,
      directionY,
      '../assets/images/lasers/laser-red.png',
    );
    this.speed = 5;
    this.height = 25;
    this.width = 10;
  }
}
