import Phaser from "phaser";
import { WIDTH, HEIGHT } from "./constants";
import { Colors } from "./constants";
import Ball from "./Ball";

class ChooseBallScene extends Phaser.Scene {
  private balls: Ball[] = [];

  constructor() {
    super('ChooseBallScene');
  }

  init(data: any): void {
    this.balls = [];
    const balls = data.balls as Ball[];
    balls.forEach(ball => {
      this.balls.push(new Ball(this, ball.getWeight()));
    });
  }

  preload(): void {
  }

  create(): void {
    this.createBalls();
    this.createText();
    this.createEventHandler();
  }

  createBalls(): void {
    const startX = (WIDTH / 2) - 55 * 13 / 2;
    this.balls.forEach((ball, idx) => {
      const x = startX + 55 * (idx + 1);
      const y = HEIGHT / 2;
      ball.create(x, y, idx + 1, 'interactive');
    });
  }

  createText(): void {
    this.add.text(WIDTH / 2, HEIGHT / 2 - 100, 'Choose fake ball:', {
      fontStyle: 'bold',
      fontSize: 24,
      color: Colors.toString(Colors.a),
    }).setOrigin(0.5);
  }

  createEventHandler(): void {
    this.input.on('pointerover', (_: Phaser.Input.Pointer, obj: Phaser.GameObjects.GameObject[]) => {
      obj.forEach(el => {
        if (el.data.has('ball')) {
          const ball = el.data.get('ball') as Ball;
          ball.setMouseOver(true);
        }
      });
    });
    this.input.on('pointerout', (_: Phaser.Input.Pointer, obj: Phaser.GameObjects.GameObject[]) => {
      obj.forEach(el => {
        if (el.data.has('ball')) {
          const ball = el.data.get('ball') as Ball;
          ball.setMouseOver(false);
        }
      });
    });
    this.input.on('pointerup', (_: Phaser.Input.Pointer, obj: Phaser.GameObjects.GameObject[]) => {
      obj.forEach(el => {
        if (el.data.has('ball')) {
          const ball = el.data.get('ball') as Ball;
          const data = {
            won: false,
          }

          if (ball.getWeight() !== 1) {
            data.won = true;
          }

          this.scene.start('GameOverScene', data);
        }
      });
    });
  }

  update(time: number, delta: number): void {
  }
}

export default ChooseBallScene;
