import { Drawable } from './Drawable.js';
import { canvas } from './app.js';

export class Invader extends Drawable {
  constructor(
    x,
    y,
    directionX = Math.random() < .5 ? -1 : 1,
    directionY = .5,
    isBonus = false,
  ) {
    super(x, y, directionX, directionY, './assets/images/invader1.png');
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 20;
    this.isBonus = isBonus;
    this.invadersNb = 10;
  }
}
