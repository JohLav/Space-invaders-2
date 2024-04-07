import { Drawable } from './Drawable.js';
// import { generateSound, soundArray } from './soundEffect';
// import { collision } from './Collision';

export class Projectile extends Drawable {
  img = null;

  constructor(x, y, player) {
    super(x, y, null, null, './assets/images/lasers/laser-blue.png');
    this.countFrame = 0;
    this.player = player;
    this.img = super.getImg();
    this.height = 50;
    this.width = 30;
  }

  projectileX() {
    return this.player.x + this.player.width / 2 - this.width / 2;
  }

  projectileY() {
    return this.player.y;
  }

  // newProjectile() {
  //   generateSound(soundArray[0].name, soundArray[0].src);
  //   const projectile = new Projectile(null, null, this.player);
  //
  //   // Pour chaque projectiles, on initialise correctement les valeurs pour que le point de depart soit le milieu du vaisseau
  //   projectile.x = this.player.x + this.player.width / 2 - this.width / 2;
  //   projectile.y = this.player.y;
  //   this.projectiles.push(projectile);
  //
  //   // Check for collision with player
  //   if (collision(this.player, projectile)) {
  //     projectile.hasCollision = true;
  //     this.hasCollision = true;
  //   }
  // };
}
