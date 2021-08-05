import Game from "./scenes/Game.js";

export const gameOptions = {
  platformSpeedRange: [300, 400],
  spawnRange: [100, 300],
  platformSizeRange: [50, 250],
  playerGravity: 900,
  jumpForce: 400,
  playerStartPosition: 200,
  platformHeightRange: [-10, 10],
  platformHeightScale: 10,
  platformVerticalLimit: [0.4, 0.7],
  jumps: 2,
  jumpForce: 400,
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
