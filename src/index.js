import "./style.scss";
import Phaser from "phaser";
import Game from "./scenes/Game.js";
import gameOptions from "./gameOptions.js";

export default new Phaser.Game({
  type: Phaser.AUTO,
  width: 400,
  height: 640,
  scene: Game,
  backgroundColor: "#4488aa",
  physics: {
    default: "arcade",
  },
});
