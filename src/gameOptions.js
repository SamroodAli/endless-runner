import Game from "./scenes/Game.js";

export const gameOptions = {
  platformSpeedRange: [300, 400],
  spawnRange: [80, 300],
  platformSizeRange: [90, 300],
  platformHeightRange: [-5, 5],
  platformHeightScale: 20,
  platformVerticalLimit: [0.4, 0.7],
  playerGravity: 900,
  jumpForce: 400,
  playerStartPosition: 200,
  jumps: 2,
  coinPercent: 25,
};

export let gameConfig = {
  type: Phaser.AUTO,
  width: screen.availWidth * 0.9,
  height: screen.availHeight * 0.8,
  scene: Game,
  backgroundColor: "#4488aa",

  physics: {
    default: "arcade",
  },
};
