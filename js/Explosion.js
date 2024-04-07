import { Drawable } from './Drawable.js';

export class Explosion extends Drawable {
  isFinished = false;
  currentFrameIndex = 0;
  width = null;
  height = null;

  constructor(x, y) {
    super(
      x,
      y,
      null,
      null,
      'assets/images/explosions/explosion1_0016.png',
      'assets/images/explosions/explosion1_0017.png',
      'assets/images/explosions/explosion1_0018.png',
      'assets/images/explosions/explosion1_0019.png',
      'assets/images/explosions/explosion1_0020.png',
      'assets/images/explosions/explosion1_0021.png',
      'assets/images/explosions/explosion1_0022.png',
    );
    this.width = 200;
    this.height = 200;
    this.frame = Math.floor(Math.random() * (this.images.length - 1));
    this.refresh = 5000;
    this.dateFrame = Date.now() + this.refresh;
  }

  getImg() {
    if (this.dateFrame < Date.now()) {
      this.dateFrame = Date.now() + this.refresh;

      if (++this.frame > this.images.length - 1) {
        this.frame = 0;
      }
    }
    return this.images[this.frame];
  }

  explosionManager(item, table) {
    this.x = item.x;
    this.y = item.y;
    table.push(this);
  }
}
