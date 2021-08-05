import "./style.scss";
import Phaser from "phaser";
import { gameConfig } from "./gameOptions.js";

new Phaser.Game(gameConfig);

const canvas = document.querySelector("canvas");
console.log(canvas.style);
