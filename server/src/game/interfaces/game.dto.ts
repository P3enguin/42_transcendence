import { off } from 'process';
import { generate as generateID } from 'shortid';

export class Player {
  score: number;
  id: number;
  nickname: string;
  socketId: string;
  constructor(id: number, nickname: string, socketId?: string) {
    this.id = id;
    this.nickname = nickname;
    this.score = 0;
    this.socketId = socketId || null;
  }
}

export enum GameType {
  'RANKED',
  'NORMAL',
  'INVITE',
}
export class Board {
  width: number;
  height: number;
  offset: number;
  constructor() {
    this.width = 700;
    this.height = this.width * 1.4;
    this.offset = 5;
  }
}

export class Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  constructor(position: 'top' | 'bottom') {
    this.width = 700 / 8;
    this.height = this.width / 5;
    if (position === 'top') {
      this.x = 700 / 4 - this.width / 2;
      this.y = 10;
    } else {
      this.x = 3 * (700 / 4) - this.width / 2;
      this.y = 700 * 1.4 - this.height - 10;
    }
  }

  updatePosition(x: number) {
    this.x = x;
  }
}

export class Ball {
  width: number;
  height: number;
  diameter: number;
  radius: number;
  x: number;
  y: number;
  newX: number;
  newY: number;
  speed: number;
  velocityX: number;
  velocityY: number;
  constructor() {
    this.width = 700 / 8 / 5;
    this.height = this.width;
    this.diameter = this.width;
    this.radius = this.diameter / 2;
    this.x = 700 / 2 - this.radius;
    this.y = (700 * 1.4) / 2 - this.radius;
    this.speed = 10;
    this.velocityX = this.speed * Math.cos(Math.PI / 4);
    this.velocityY = this.speed * Math.sin(Math.PI / 4);
  }

  setNextPosition() {
    this.newX = this.x + this.velocityX;
    this.newY = this.y + this.velocityY;
  }

  updatePosition() {
    this.x = this.newX;
    this.y = this.newY;
  }
}

export class Game {
  id: string;
  players: [Player?, Player?];
  paddle: [Paddle, Paddle];
  ball: Ball;
  board: Board;
  type: GameType;
  spectator: Player[];
  createdAt: Date;
  updatedAt: Date;
  inteval: NodeJS.Timeout;
  gameOn: boolean;

  constructor(gameType: GameType) {
    this.id = generateID();
    this.players = [];
    this.spectator = [];
    this.type = gameType;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.board = new Board();
    this.paddle = [new Paddle('bottom'), new Paddle('top')];
    this.ball = new Ball();
    this.inteval = null;
  }

  isActive() {
    // check if game is full and both players are connected
    return (
      this.players.length === 2 &&
      this.players[0].socketId &&
      this.players[1].socketId
    );
  }

  connectPlayer(nickname: string, socketId: string) {
    const player = this.isPlayer(nickname);
    if (player) player.socketId = socketId;
  }

  isPlayer(nickname: string) {
    return this.players.find((p) => p.nickname === nickname);
  }

  addSpectator(spectator: Player) {
    this.spectator.push(spectator);
  }

  removePlayer(nickname: string) {
    this.players = this.players.filter((p) => p.nickname !== nickname) as [
      Player?,
      Player?,
    ];
  }

  getPlayerPosition(nickname: string) {
    const player = this.players.find((p) => p.nickname === nickname);
    return this.players.indexOf(player) === 0 ? 'Bottom' : 'Top';
  }

  movePaddle(position: string, x: number) {
    if (position === 'Bottom') {
      this.paddle[0].updatePosition(x);
    } else if (position === 'Top') {
      this.paddle[1].updatePosition(x);
    }
  }

  checkWallCollision() {
    if (
      this.ball.newX <= this.board.offset ||
      this.ball.newX + this.ball.diameter >=
        this.board.width - this.board.offset
    ) {
      this.ball.velocityX = -this.ball.velocityX;
    }
  }

  checkPaddleCollision() {
    // bottom paddle
    if (
      this.ball.newX + this.ball.diameter >= this.paddle[0].x &&
      this.ball.newX <= this.paddle[0].x + this.paddle[0].width
    ) {
      if (this.ball.newY >= this.paddle[0].y - this.ball.diameter) {
        this.ball.velocityY = -Math.abs(this.ball.velocityY);
      }
    }

    // top paddle
    if (
      this.ball.newX + this.ball.diameter >= this.paddle[1].x &&
      this.ball.newX <= this.paddle[1].x + this.paddle[1].width
    ) {
      if (this.ball.newY <= this.paddle[1].y + this.paddle[1].height) {
        this.ball.velocityY = Math.abs(this.ball.velocityY);
      }
    }
  }

  checkNewScore(): boolean {
    if (this.ball.newY <= this.board.offset) {
      this.ball.newY = this.board.height / 2 - this.ball.radius;
      this.players[1].score++;
      return true;
    } else if (
      this.ball.newY + this.ball.diameter >=
      this.board.height - this.board.offset
    ) {
      this.ball.newY = this.board.height / 2 - this.ball.radius;
      this.players[0].score++;
      return true;
    }
    return false;
  }

  updateGame() {
    this.ball.setNextPosition();

    // check if ball is colliding with Wall
    this.checkWallCollision();

    // check if ball is colliding with paddle
    this.checkPaddleCollision();

    // check if ball scored
    this.checkNewScore();

    // update ball position
    this.ball.updatePosition();
    return {
      ball: { x: Math.round(this.ball.x), y: Math.round(this.ball.y) },
      topPaddle: { x: Math.round(this.paddle[1].x) },
      bottomPaddle: { x: Math.round(this.paddle[0].x) },
    };
  }

  getScore() {
    return {
      // this.players[0].nickname: this.players[0].score,
      // this.players[1].nickname: this.players[1].score,
      top: this.players[1].score,
      bottom: this.players[0].score,
    };
  }

  start() {
    this.gameOn = true;
  }

  End() {
    this.gameOn = false;
  }
}
