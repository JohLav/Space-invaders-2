export function collision(obj1, obj2) {
  return (
    obj1.x < obj2.width + obj2.x &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.height + obj2.y &&
    obj1.y + obj1.height > obj2.y
  );
}

export function collisionScreen(player, canvas) {
  if (player.x < 0) {
    player.x = 0;
  }
  if (player.y < 0) {
    player.y = 0;
  }
  if (player.x + player.width > canvas.width) {
    player.x = canvas.width - player.width;
  }
}
