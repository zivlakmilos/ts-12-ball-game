import Phaser, { Game } from "phaser";
import { WIDTH, HEIGHT } from "./constants";
import { Colors } from "./constants";

class GameOverScene extends Phaser.Scene {
  private message: string = '';

  constructor() {
    super('GameOverScene');
  }

  init(data: any): void {
    this.message = data.won ? 'Congrads, You Won!' : 'You\'re Looser!';
  }

  create(): void {
    this.add.text(WIDTH / 2, HEIGHT / 2 - 100, 'Game Over', {
      fontStyle: 'bold',
      fontSize: 24,
      color: Colors.toString(Colors.a),
    }).setOrigin(0.5);

    this.add.text(WIDTH / 2, HEIGHT / 2, this.message, {
      fontStyle: 'bold',
      fontSize: 28,
      color: Colors.toString(Colors.a),
    }).setOrigin(0.5);

    const btnReset = this.add.rectangle(WIDTH / 2, HEIGHT / 2 + 100, 100, 50, Colors.a)
      .setOrigin(0.5)
      .setInteractive();
    const btnCenter = btnReset.getCenter();
    this.add.text(btnCenter.x, btnCenter.y, 'Reset', {
      fontStyle: 'bold',
      fontSize: 18,
      color: Colors.toString(Colors.white),
    }).setOrigin(0.5);

    btnReset.on('pointerover', () => {
      btnReset.setFillStyle(Colors.b);
    });
    btnReset.on('pointerout', () => {
      btnReset.setFillStyle(Colors.a);
    });
    btnReset.on('pointerup', () => {
      this.scene.start('PlayScene');
    });
  }
}

export default GameOverScene;
