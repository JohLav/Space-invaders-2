import { Bonus } from './Bonus.js';
import { Player } from './Player.js';
import { Invader } from './Invader.js';
import { Explosion } from './Explosion.js';
import { Projectile } from './Projectile.js';
import { InvaderProjectile } from './InvaderProjectile.js';
import { soundArray, generateSound } from './functions/soundEffect.js';
import { collision, collisionScreen } from './functions/collision.js';
import { screen } from './functions/screen.js';
import {
  canvas,
  contentMenu,
  ctx,
  menu,
  startBtn,
  titleMenu,
  tutorial,
} from './app.js';
import { keyListener, keys } from './functions/move.js';

export class GameEngine {
  bonusPosition = null;
  explosions = [];
  fpsInterval = null;
  hasCollision = false;
  intervalId = null;
  invaderProjectiles = [];
  invadersOnEarth = null;
  invadersSpeed = null;
  isGameOver = null;
  invaders = [];
  lastFrameTime = null;
  level = null;
  player = null;
  projectiles = [];
  projectileSpeed = null;
  speed = null;

  bonusObj = [
    {
      bonusEffect: () => {
        this.projectileSpeed = 50;
        this.currentBonus = 'SpeedFire';
      },
    },
    {
      bonusEffect: () => {
        this.bonusFirePower();
        this.currentBonus = 'PowerFire';
      },
    },
    {
      bonusEffect: () => {
        this.player.lives += 1;
        this.currentBonus = 'OneLifeBonus';
      },
    },
    {
      bonusEffect: () => {
        this.destroyAllInvaders();
        this.currentBonus = 'NukeBonus';
      },
    },
  ];

  constructor() {
    this.canvas = canvas;
    this.ctx = ctx;
    this.canvas.width = innerWidth;
    this.canvas.height = innerHeight;

    // Initialisation
    this.player = new Player();
    this.invader = new Invader();
    this.explosion = new Explosion();

    this.isGameOver = false;
    this.level = 1;
    this.lastFrameTime = performance.now();
    this.fpsInterval = 1000 / 100; //
    this.invadersOnEarth = false;
    // SPEED
    this.speed = 5;
    this.projectileSpeed = 10;
    this.invadersSpeed = 1;
    // SOUNDS
    this.startSound = true;
    // BONUS
    this.bonusPosition = 0;
    this.isBonusDiscoverd = false;
    this.isBonusTaken = false;
    this.newBonus = new Bonus(-100, -100, null, this.bonusChoice);
    this.currentBonus = null;
    this.firePower = false;
    this.nbOfInvaders = 10;
    this.rotation = 0;
  }

  init() {
    this.resetBonus();
    this.bonusChoice = Math.floor(Math.random() * this.bonusObj.length);

    this.player.initPlayer();

    if (this.isGameOver) {
      this.resetConfig();
      this.isGameOver = false;
    } else {
      if (startBtn.textContent === 'Niveau suivant') {
        this.nextLevelConfig();
      }
    }

    this.invadersOnEarth = false;

    this.generateInvaders();

    if (this.invaders.length !== 0) {
      this.generateInvadersProjectiles();
    }
    this.generateBonusPosition();
  }

  generateInvaders() {
    for (let i = 0; i < this.nbOfInvaders; i++) {
      const newInvader = new Invader(
        Math.random() * (this.canvas.width - this.invader.width),
        this.invader.height - i * (this.invader.height / 2),
      );
      this.invaders.push(newInvader);
    }
  }

  moveInvaders() {
    for (let invader of this.invaders) {
      // vérifier s'l y a collision par défaut collision=false
      if (!invader.hasCollision) {
        // permet d'établir la vitesse de déplacement horizontale
        invader.x += invader.directionX * this.invadersSpeed;
        // permet d'établir la vitesse de descente verticale
        invader.y += (invader.directionY * this.invadersSpeed) / 3;
        // vérif si les bords sont touchés si oui la direction du déplacement est inversée avec *-1
        if (invader.x <= 0 || invader.x + invader.width >= this.canvas.width) {
          invader.directionX *= -1;
        }
        if (invader.y + invader.height > this.canvas.height) {
          this.invadersOnEarth = true;
          invader.y = this.canvas.height - invader.height;
          this.invadersSpeed = 0;
          this.gameOver('La Terre a été envahie !!!');
        }
        // va permettre la collision de chaque élément du tableau
        if (collision(this.player, invader)) {
          if (this.player.lives > 1) {
            generateSound('playerCollidedWithInvader');
            invader.hasCollision = true;
            this.hasCollision = true;
            this.explosion.explosionManager(invader, this.explosions);
            this.invaders.splice(invader, 1);
            this.player.lives--;
          } else if (this.player.lives === 1) {
            generateSound('playerIsDead');

            this.hasCollision = true;
            this.player.lives = 0;
            this.gameOver("Un envahisseur t'a tué !");
          }
        }
      }
    }
  }

  initEvent() {
    keyListener('keydown', true);

    // keyListener('keyup', false);

    window.addEventListener('keyup', event => {
      switch (event.key) {
        case 'ArrowLeft':
          keys.left = false;
          break;
        case 'ArrowRight':
          keys.right = false;
          break;
        case ' ':
          if (!this.isGameOver) {
            keys.space = false;

            this.newProjectile();
            if (this.firePower) {
              this.bonusFirePowerAction();
            }
          }
          break;
        //Ajout d'une touche pour supprimer tous les invaders, pour tester le niveau suivant
        case 'p':
          keys.p = false;
          break;
      }
    });
  }

  newProjectile () {
    generateSound('laserShoot');
    const projectile = new Projectile(
      null,
      null,
      this.player);

    // Pour chaque projectiles, on initialise correctement les valeurs pour que le point de depart soit le milieu du vaisseau
    projectile.x = projectile.projectileX();
    projectile.y = projectile.projectileY();
    this.projectiles.push(projectile);

    // Check for collision with player
    if (collision(this.player, projectile)) {
      projectile.hasCollision = true;
      this.hasCollision = true;
    }
  };

  generateBonusPosition() {
    this.bonusPosition = Math.floor(Math.random() * this.invaders.length);
    this.invaders[this.bonusPosition].isBonus = true;
  }

  generateInvadersProjectiles = () => {
    clearInterval(this.intervalId);
    if (this.invaders.length !== 0) {
      this.intervalId = setInterval(() => {
        const selectInvaders = Math.floor(Math.random() * this.invaders.length);
        const invaderProjectile = new InvaderProjectile(
          this.invaders[selectInvaders]?.x,
          this.invaders[selectInvaders]?.y,
          5,
          -100,
          this.invaders[selectInvaders]?.getImg().width / 2,
        );
        this.invaderProjectiles.push(invaderProjectile);
      }, 1000);
    }
  };

  //*******************************DESTRUCTION PLAYER ET INVADERS ***************************************//
  destroyPlayer() {
    for (let i = 0; i < this.invaderProjectiles.length; i++) {
      const invaderProjectile = this.invaderProjectiles[i];
      if (collision(invaderProjectile, this.player)) {
        if (this.player.lives > 1) {
          generateSound('playerCollidedWithInvader');
          invaderProjectile.hasCollision = true;
          this.explosion.explosionManager(invaderProjectile, this.explosions);
          this.invaderProjectiles.splice(i, 1);
          this.player.lives--;
          return true;
        } else if (this.player.lives === 1) {
          this.gameOver("Tu n'as plus de vies !");
          this.explosion.explosionManager(this.player, this.explosions);
          // this.explosionInvaders(this.player);
          generateSound('playerIsDead');
          generateSound('spaceshipExplosion');
          this.player.lives = 0;
        }
      }
    }
    return false;
  }

  destroyInvaders() {
    for (let i = 0; i < this.projectiles.length; i++) {
      const playerProjectile = this.projectiles[i];
      for (let j = 0; j < this.invaders.length; j++) {
        if (
          collision(playerProjectile, this.invaders[j]) &&
          this.invaders[j].isBonus === false
        ) {
          generateSound('playerKilledInvader');
          playerProjectile.hasCollision = true;
          this.explosion.explosionManager(this.invaders[j], this.explosions);
          this.projectiles.splice(i, 1);
          this.invaders.splice(j, 1);
          return true;
        } else if (
          collision(playerProjectile, this.invaders[j]) &&
          this.invaders[j].isBonus === true
        ) {
          this.isBonusDiscoverd = true;
          generateSound('playerKilledInvader');
          playerProjectile.hasCollision = true;

          this.newBonus.x = this.invaders[j].x;
          this.newBonus.y = this.invaders[j].y;

          this.explosion.explosionManager(this.invaders[j], this.explosions)
          this.projectiles.splice(i, 1);
          this.invaders.splice(j, 1);

          return true;
        }
      }
    }
  }
  //******************************************************************************//
  update() {
    let prevX = this.player.x;
    let prevY = this.player.y;
    this.rotation = 0;

    if (keys.left) {
      this.player.x -= this.speed;
      this.rotation -= .3;
    }
    if (keys.right) {
      this.player.x += this.speed;
      this.rotation += .3;
    }
    if (keys.p) {
      this.invaders = [];
    }

    this.projectiles = this.projectiles.filter(
      projectile => projectile.y + projectile.height > 0,
    );
    for (let projectile of this.projectiles) {
      projectile.y -= this.projectileSpeed;
    }

    this.invaderProjectiles = this.invaderProjectiles.filter(
      invaderProjectile =>
        invaderProjectile.y + invaderProjectile.getImg().height > 0,
    );
    for (let invaderProjectile of this.invaderProjectiles) {
      invaderProjectile.y += 3;
    }

    if (!this.isGameOver) {
      this.explosions = this.explosions.filter(explosion => {
        return !explosion.isFinished;
      });
    }

    this.destroyPlayer();
    this.destroyInvaders();

    collisionScreen(this.player, this.canvas);

    this.dropBonus();
    this.takeBonus();

    if (this.moveInvaders()) {
      this.player.x = prevX;
      this.player.y = prevY;
    }

    if (this.invadersOnEarth) {
      this.gameOver('Les envahisseurs ont atteint la Terre !');
    }
    if (this.invaders.length === 0) {
      this.nextLevel();
    }

    for (let explosion of this.explosions) {
      if (!explosion.isFinished) {
        explosion.currentFrameIndex++;

        if (explosion.currentFrameIndex >= explosion.images.length) {
          explosion.isFinished = true;
        }
      }
    }

    screen(
      this.player.lives,
      this.invaders,
      this.level,
      this.currentBonus ? this.currentBonus : 'Aucun',
    );
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    this.ctx.translate(
      this.player.x + this.player.width / 2,
      this.player.y + this.player.height / 2,
    );
    this.ctx.rotate(this.rotation);
    this.ctx.translate(
      -this.player.x - this.player.width / 2,
      -this.player.y - this.player.height / 2,
    );
    this.ctx.drawImage(
      this.player.getImg(),
      this.player.x,
      this.player.y,
      this.player.width,
      this.player.height,
    );

    this.ctx.restore();
    for (let item of this.invaders) {
      this.ctx.drawImage(
        item.getImg(),
        item.x,
        item.y,
        item.width,
        item.height,
      );
    }

    if (this.newBonus !== null) {
      this.ctx.drawImage(
        this.newBonus.getImg(),
        this.newBonus.x,
        this.newBonus.y,
      );
    }

    this.drawExplosions();
    this.drawNewProjectile();
    this.drawInvaderProjectile();
  }

  drawNewProjectile() {
    this.projectiles.forEach(projectile => {
      this.ctx.drawImage(
        projectile.getImg(),
        projectile.x,
        projectile.y,
        projectile.width,
        projectile.height,
      );
    });
  }

  drawInvaderProjectile() {
    this.invaderProjectiles.forEach(invaderProjectile => {
      this.ctx.drawImage(
        invaderProjectile.getImg(),
        invaderProjectile.x,
        invaderProjectile.y,
        invaderProjectile.width,
        invaderProjectile.height,
      );
    });
  }

  drawExplosions() {
    if (this.isGameOver) {
      this.explosions.forEach(explosion => {
        this.ctx.drawImage(
          explosion.getImg(),
          (explosion.x = this.player.x - this.player.width / 2),
          (explosion.y = this.player.y - this.player.height / 2),
          explosion.width,
          explosion.height,
        );
      });
    }
    this.explosions.forEach(explosion => {
      this.ctx.drawImage(explosion.getImg(), explosion.x, explosion.y);
    });
  }

  gameLoop() {
    const currentTime = performance.now(); // Le temps maintenant
    const elapsed = currentTime - this.lastFrameTime; // Le temps ecoulé

    if (elapsed > this.fpsInterval) {
      // Mettre à jour le dernier temps de frame pour le prochain cycle
      this.lastFrameTime = currentTime - (elapsed % this.fpsInterval);
      this.update();
      this.draw();
    }

    window.requestAnimationFrame(() => {
      this.gameLoop();
    });
  }

  run() {
    this.init();
    this.initEvent();
    this.gameLoop();
    this.showTutorial();
  }

  showTutorial() {
    tutorial.style.display = 'flex';
    tutorial.classList.add('fade-out');
    setTimeout(() => {
      tutorial.style.display = 'none';
    }, 8000);
  }

  //Configuration des modifications a ajouter pour le niveau suivant
  nextLevel() {
    this.projectiles = [];
    this.invaderProjectiles = [];
    titleMenu.innerText = 'BRAVO';
    contentMenu.innerText = 'Vous avez tué tous les envahisseurs !!!';
    startBtn.innerText = 'Niveau suivant';
    menu.style.display = 'flex';
  }

  nextLevelConfig() {
    let incrSpeed = 1.5;
    let incrInvaders = 1;
    let incrInvadersSpeed = 0.5;
    if (this.level > 5) {
      incrSpeed = 0;
      incrInvadersSpeed = 0.1;
    }
    this.resetBonus();
    this.nbOfInvaders += incrInvaders;
    this.speed += incrSpeed;
    this.invadersSpeed += incrInvadersSpeed;
    this.player.lives = 3;
    this.projectiles = [];
    this.level++;
  }

  resetConfig() {
    this.nbOfInvaders = 10;
    this.level = 1;
    this.player.lives = 3;
    this.speed = 5;
    this.invaders = [];
    this.invadersSpeed = 1;
    this.projectiles = [];
    this.invaderProjectiles = [];
    this.hasCollision = false;
    this.projectileSpeed = 10;
    this.level = 1;
  }

  gameOver(textContentMenu) {
    this.isGameOver = true;
    clearInterval(this.intervalId);
    this.hasCollision = true;
    titleMenu.innerText = 'GAME OVER';
    contentMenu.innerText = textContentMenu;
    startBtn.innerText = 'Restart';
    menu.style.display = 'flex';
  }

  // Tableau et fonctions bonus
  dropBonus() {
    if (this.isBonusDiscoverd && !this.isBonusTaken) {
      this.newBonus.y += this.invadersSpeed;
    }
  }

  takeBonus() {
    if (collision(this.player, this.newBonus)) {
      generateSound('bonusTaken');
      this.isBonusTaken = true;
      this.resetBonusPosition();
      this.bonusObj[this.bonusChoice].bonusEffect();
    }
  }

  resetBonusPosition() {
    this.newBonus.y = -100;
  }

  destroyAllInvaders() {
    generateSound('playerKilledInvader');
    for (let j = this.invaders.length - 1; j >= 0; j--) {
      this.explosion.explosionManager(this.invaders[j], this.explosions);
      this.invaders.splice(j, 1);
    }
    return true;
  }

  resetBonus() {
    if (!this.isBonusDiscoverd) {
      this.resetBonusPosition();
    }
    this.firePower = false;
    this.projectileSpeed = 10;
    this.isBonusTaken = false;
    this.isBonusDiscoverd = false;
    this.currentBonus = null;
  }

  bonusFirePower() {
    this.firePower = true;
    this.projectileSpeed = 10;
  }

  bonusFirePowerOne() {
    const projectile = new Projectile(null, null, this.player);

    // We initialise the values so that the starting point is the middle of the spaceship
    projectile.x = projectile.projectileX() + 50;
    projectile.y = projectile.projectileY();
    this.projectiles.push(projectile);
  }

  bonusFirePowerTwo() {
    const projectile = new Projectile(null, null, this.player);

    // We initialise the values so that the starting point is the middle of the spaceship
    projectile.x = projectile.projectileX() - 50;
    projectile.y = projectile.projectileY();
    this.projectiles.push(projectile);
  }

  bonusFirePowerAction() {
    this.bonusFirePowerOne();
    this.bonusFirePowerTwo();
  }
}