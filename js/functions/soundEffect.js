export const soundArray = [
  {
    id: 1,
    name: 'laserShoot',
    src: '../assets/sounds/laser-shoot.mp3',
  },
  {
    id: 2,
    name: 'playerCollidedWithInvader',
    src: '../assets/sounds/collision.mp3',
  },
  {
    id: 3,
    name: 'playerIsDead',
    src: '../assets/sounds/wilhelm.mp3',
  },
  {
    id: 4,
    name: 'playerKilledInvader',
    src: '../assets/sounds/invaders-explosion.wav',
  },
  {
    id: 5,
    name: 'ambiance',
    src: '../assets/sounds/ambiance.mp3',
  },
  {
    id: 6,
    name: 'spaceshipExplosion',
    src: '../assets/sounds/spaceship-explosion.mp3',
  },
  {
    id: 7,
    name: 'bonusTaken',
    src: '../assets/sounds/bonus.mp3',
  },
];

export const generateSound = (soundName, isLooping = false) => {
  let newAudio = null;

  for (let i = 0; i < soundArray.length; i++) {
    if (soundName === soundArray[i].name) {
      newAudio = new Audio(soundArray[i].src);
      newAudio.loop = isLooping;
      newAudio.play().catch(error => {
        console.log('Failed to play audio:', error);
      })
    }
  }

  return newAudio;
};
