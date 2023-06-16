import Phaser from "phaser";
import { WIDTH, HEIGHT, Colors } from "./constants";
import PlayScene from "./PlayScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: WIDTH,
  height: HEIGHT,
  backgroundColor: Colors.c,
  physics: {
    default: 'arcade',
  },
  scene: [PlayScene],
};

new Phaser.Game(config);
