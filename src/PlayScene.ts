import Phaser from "phaser";
import { WIDTH, HEIGHT, Colors } from "./constants";
import { shuffle } from "./utils";
import Ball from "./Ball";

class PlayScene extends Phaser.Scene {
  private balls: Ball[] = [];

  private leftBalls: Ball[] = [];
  private rightBalls: Ball[] = [];

  private line: Phaser.GameObjects.Line;
  private dropArea1: Phaser.GameObjects.Rectangle;
  private dropArea2: Phaser.GameObjects.Rectangle;

  private btnWeight: Phaser.GameObjects.Rectangle;
  private txtWeight: Phaser.GameObjects.Text;
  private btnReset: Phaser.GameObjects.Rectangle;

  private measurementsLeft: number;
  private txtMeasurementsLeft: Phaser.GameObjects.Text;

  constructor() {
    super('PlayScene');
  }

  preload(): void {
  }

  create(): void {
    this.createScale();
    this.createBalls();
    this.createButtons();
    this.createMeasurementText();
    this.createEventHandlers();
  }

  createScale(): void {
    const screenCenter = [WIDTH / 2, HEIGHT * 2 / 3];
    const size = 20;

    this.add.triangle(
      screenCenter[0], screenCenter[1],
      0, 0,
      -size, 2 * size,
      size, 2 * size,
      Colors.b,
    ).setOrigin(0, 0);

    this.line = this.add.line(
      screenCenter[0], screenCenter[1],
      0, 0,
      size * 40, 0,
      Colors.b,
    );

    this.dropArea1 = this.add.rectangle(screenCenter[0], screenCenter[1] - 3, size * 40 / 2, size * 40 / 4, Colors.d)
      .setOrigin(1)
      .setVisible(false);

    this.dropArea2 = this.add.rectangle(screenCenter[0], screenCenter[1] - 3, size * 40 / 2, size * 40 / 4, Colors.d)
      .setOrigin(0, 1)
      .setVisible(false);
  }

  createBalls(): void {
    this.balls = [];
    this.leftBalls = [];
    this.rightBalls = [];

    this.balls.push(new Ball(this, Math.random() + 0.5));
    for (let i = 0; i < 11; i++) {
      this.balls.push(new Ball(this, 1));
    }
    shuffle(this.balls);

    const startX = (WIDTH / 2) - 55 * 13 / 2;
    this.balls.forEach((ball, idx) => {
      const x = startX + 55 * (idx + 1);
      const y = 55;
      ball.create(x, y, idx + 1);
    });
  }

  createButtons(): void {
    const screenCenter = [WIDTH / 2, HEIGHT * 5 / 6];

    let btnCenter;

    const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontStyle: 'bold',
      fontSize: 18,
      color: Colors.toString(Colors.white),
    }

    this.btnWeight = this.add.rectangle(screenCenter[0] - 3, screenCenter[1], 100, 50, Colors.a)
      .setOrigin(1, 0)
      .setInteractive();
    btnCenter = this.btnWeight.getCenter();
    this.txtWeight = this.add.text(btnCenter.x, btnCenter.y, 'Weight', textStyle)
      .setOrigin(0.5);

    this.btnReset = this.add.rectangle(screenCenter[0] + 3, screenCenter[1], 100, 50, Colors.a)
      .setOrigin(0, 0)
      .setInteractive();
    btnCenter = this.btnReset.getCenter();
    this.add.text(btnCenter.x, btnCenter.y, 'Reset', textStyle)
      .setOrigin(0.5);

    this.btnWeight.on('pointerover', () => {
      this.btnWeight.setFillStyle(Colors.b);
    });
    this.btnWeight.on('pointerout', () => {
      this.btnWeight.setFillStyle(Colors.a);
    });

    this.btnReset.on('pointerover', () => {
      this.btnReset.setFillStyle(Colors.b);
    });
    this.btnReset.on('pointerout', () => {
      this.btnReset.setFillStyle(Colors.a);
    });
  }

  createMeasurementText() {
    const screenCenter = [WIDTH / 2, HEIGHT * 5 / 6];

    this.measurementsLeft = 3;
    this.txtMeasurementsLeft = this.add.text(screenCenter[0], screenCenter[1] + 75, `${this.measurementsLeft} measurements left`, {
      fontStyle: 'bold',
      fontSize: 18,
      color: Colors.toString(Colors.a),
    }).setOrigin(0.5);
  }

  createEventHandlers(): void {
    this.input.on('drag', (pointer: any, obj: Phaser.GameObjects.GameObject, dragX: number, dragY: number) => {
      const ball = obj.getData('ball') as Ball | undefined;
      if (ball && this.txtWeight.text === 'Weight') {
        ball.updatePos(dragX, dragY);

        this.dropArea1.setVisible(this.dropArea1.getBounds().contains(dragX, dragY));
        this.dropArea2.setVisible(this.dropArea2.getBounds().contains(dragX, dragY));
      }
    }, this);

    this.input.on('dragend', (pointer: any, obj: Phaser.GameObjects.GameObject, dragX: number, dragY: number) => {
      if (this.txtWeight.text !== 'Weight') {
        return;
      }

      const ball = obj.getData('ball') as Ball | undefined;
      if (ball) {
        this.rightBalls = this.rightBalls.filter(el => el.getNumber() !== ball.getNumber());
        this.leftBalls = this.leftBalls.filter(el => el.getNumber() !== ball.getNumber());
        if (this.dropArea1.getBounds().contains(pointer.x, pointer.y)) {
          this.leftBalls.push(ball);
        } else if (this.dropArea2.getBounds().contains(pointer.x, pointer.y)) {
          this.rightBalls.push(ball);
        } else {
          ball.resetPos();
        }
      }

      this.repositionBalls();

      this.dropArea1.setVisible(false);
      this.dropArea2.setVisible(false);
    }, this);

    this.btnWeight.on('pointerup', () => {
      if (this.txtWeight.text === 'Next') {
        if (this.measurementsLeft <= 0) {
          this.scene.start('ChooseBallScene', {
            balls: this.balls,
          })
          return;
        }

        this.txtWeight.setText('Weight');
        this.leftBalls = [];
        this.rightBalls = [];
        this.balls.forEach(ball => {
          ball.resetPos();
        });
        this.line.setAngle(0);
        this.dropArea1.setAngle(0);
        this.dropArea2.setAngle(0);
        this.repositionBalls();
        return;
      }

      this.measurementsLeft--;
      this.txtMeasurementsLeft.setText(`${this.measurementsLeft} measurements left`);
      this.txtWeight.setText('Next');

      const totalLeft = this.leftBalls.reduce((acc, curr) => acc += curr.getWeight(), 0);
      const totalRight = this.rightBalls.reduce((acc, curr) => acc += curr.getWeight(), 0);

      if (totalLeft > totalRight) {
        this.line.setAngle(-15);
        this.dropArea1.setAngle(-15);
        this.dropArea2.setAngle(-15);
        this.repositionBalls(-15);
      } else if (totalLeft < totalRight) {
        this.line.setAngle(15);
        this.dropArea1.setAngle(15);
        this.dropArea2.setAngle(15);
        this.repositionBalls(15);
      }
    }, this);

    this.btnReset.on('pointerup', () => {
      this.scene.restart();
    }, this);
  }

  repositionBalls(angle: number = 0): void {
    const bounds = this.line.getBounds();

    let firstBall: Ball | undefined = undefined;
    this.leftBalls.forEach((ball, idx) => {
      if (idx === 0) {
        let distX = ball.getSize() + 3;
        let distY = ball.getSize() + 3;

        if (angle < 0) {
          distY += 10;
          distX -= 3;
        } else if (angle > 0) {
          distY -= 7;
          distX += 7;
        }

        const x = bounds.left + distX;
        const y = (angle < 0 ? bounds.bottom : bounds.top) - distY;
        ball.updatePos(x, y);
        firstBall = ball;
        return;
      }
      const distX = (idx * ball.getSize() * 2) * Math.cos(angle * Math.PI / 180);
      const distY = (idx * ball.getSize() * 2) * Math.sin(angle * Math.PI / 180);

      const x = firstBall.getPos().x + distX;
      const y = firstBall.getPos().y + distY;

      ball.updatePos(x, y);
    });

    this.rightBalls.forEach((ball, idx) => {
      if (idx === 0) {
        let distX = ball.getSize() + 3;
        let distY = ball.getSize() + 3;

        if (angle < 0) {
          distY -= 7;
          distX += 10;
        } else if (angle > 0) {
          distY += 10;
          distX -= 3;
        }

        const x = bounds.right - distX;
        const y = (angle < 0 ? bounds.top : bounds.bottom) - distY;
        ball.updatePos(x, y);
        firstBall = ball;
        return;
      }
      const distX = (idx * ball.getSize() * 2) * Math.cos(-angle * Math.PI / 180);
      const distY = (idx * ball.getSize() * 2) * Math.sin(-angle * Math.PI / 180);

      const x = firstBall.getPos().x - distX;
      const y = firstBall.getPos().y + distY;

      ball.updatePos(x, y);
    });
  }

  update(time: number, delta: number): void {
  }
}

export default PlayScene;
