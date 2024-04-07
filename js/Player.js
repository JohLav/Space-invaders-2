import { canvas } from './app.js';

export class Player {
  constructor(x = 0, y = 0) {
    this.img = new Image();
    this.img.src = './assets/images/space-ship.png';
    this.x = x;
    this.y = y;
    this.width = 100;
    this.height = 100;
    this.lives = 3;
  }

  getImg() {
    return this.img;
  }

  initPlayer() {
    if (!canvas) {
      throw new Error('Canvas is not defined');
    }
    this.x = canvas.width / 2 - this.width / 2;
    this.y = canvas.height - (this.height * 2);
  }

  // decreaseLives(element) {
  //   if (this.lives > 0) {
  //     this.gameEngine.hasCollision = true;
  //     element.hasCollision = true;
  //     this.lives--;
  //   } else {
  //     this.gameEngine.gameOver(
  //         document.getElementById('contentMenu').innerText = "Tu n'as plus de vies !"
  //     )
  //     this.gameEngine.hasCollision = false;
  //     element.hasCollision = false;
  //   }
  // }

  loaded(callback) {
    this.img.onload = () => {
      callback();
    };
  }
}
