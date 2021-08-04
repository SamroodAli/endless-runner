import "./style.scss";
import Phaser from "phaser";
import Game from "./scenes/Game.js";
import gameOptions from "./gameOptions.js";

export default new Phaser.Game({
  type: Phaser.AUTO,
  width: screen.width,
  height: screen.height,
  scene: Game,
  backgroundColor: "#4488aa",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
});
