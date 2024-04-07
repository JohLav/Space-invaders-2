import { GameEngine } from './GameEngine.js';
import { generateSound } from './functions/soundEffect.js';

// Export different elements by ID
export const bottomContainer = document.getElementById('bottom-container');
export const canvas = document.getElementById('canvas');
export const contentMenu = document.getElementById('contentMenu');
export const ctx = canvas.getContext('2d');
export const menu = document.getElementById('menu');
export const startBtn = document.getElementById('startBtn');
export const titleMenu = document.getElementById('titleMenu');
export const tutorial = document.getElementById('tutorial');

const gameEngine = new GameEngine();

startBtn.onclick = () => {
  menu.style.display = 'none';
  if (startBtn.textContent === 'Niveau suivant') {
    gameEngine.init();
  } else {
    gameEngine.run();
    generateSound('ambiance', true);
  }
};
