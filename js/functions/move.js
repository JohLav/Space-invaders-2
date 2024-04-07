export const keys = {
  left: false,
  right: false,
  space: false,
  p: false,
};

export function keyListener(type, isPushed) {
  // Keyboard input listener to move player
  window.addEventListener(type, event => {
    switch (event.key) {
      case 'ArrowLeft':
        keys.left = isPushed;
        break;
      case 'ArrowRight':
        keys.right = isPushed;
        break;
      case ' ':
        keys.space = isPushed;
        break;
      // Delete all invaders for next level
      case 'p':
        keys.p = isPushed;
        break;
    }
  });
}

export function movePlayer(player, speed) {
  // Add player's speed
  if (keys.left) {
    player.x -= speed;
  }
  if (keys.right) {
    player.x += speed;
  }
}
