import Game from "./scenes/Game.js";

export const gameOptions = {
  platformStartSpeed: 350,
  spawnRange: [100, 350],
  platformSizeRange: [50, 250],
  playerGravity: 900,
  jumpForce: 400,
  playerStartPosition: 200,
  jumps: 2,
};

export let gameConfig = {
  type: Phaser.AUTO,
  width: screen.width,
  height: screen.height,
  scene: Game,
  backgroundColor: "#4488aa",

  physics: {
    default: "arcade",
  },
};
