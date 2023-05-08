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
    this.x = 350;
    if (position === 'top') {
      this.y = 10;
    } else {
      this.y = 700 - this.height - 10;
    }
  }
}

export class Ball {
  width: number;
  height: number;
  diameter: number;
  radius: number;
  x: number;
  y: number;
  speed: number;
  velocityX: number;
  velocityY: number;
  constructor() {
    this.width = (700 / 8) / 5;
    this.height = this.width;
    this.diameter = this.width;
    this.radius = this.diameter / 2;
    this.x = (700/2)-this.radius;
    this.y = ((700 * 1.4) / 2) - this.radius;
    this.speed = 10;
    this.velocityX = this.speed*Math.cos(Math.PI/4);
    this.velocityY = this.speed * Math.sin(Math.PI / 4);
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

  isFull() {
    // check if game is full and both players are connected
    return (
      this.players.length === 2 &&
      this.players[0].socketId &&
      this.players[1].socketId
    );
  }

  connectPlayer(nickname: string, socketId: string) {
    const player = this.players.find((p) => p.nickname === nickname);
    if (player) {
      player.socketId = socketId;
    }
  }

  isPlayer(nickname: string) {
    return this.players.find((p) => p.nickname === nickname);
  }

  addSpectator(player: Player) {
    this.spectator.push(player);
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

  updateGame(): {x: number, y: number} {
    let newBallX = this.ball.x + this.ball.velocityX;
    let newBallY = this.ball.y + this.ball.velocityY;

    // check if ball is colliding with paddle
    if (newBallX <= this.board.offset || newBallX + this.ball.diameter >= this.board.width - this.board.offset) {
      this.ball.velocityX = -this.ball.velocityX;
    }

    if (newBallY <= this.board.offset || newBallY + this.ball.diameter >= this.board.height - this.board.offset) {
      this.ball.velocityY = -this.ball.velocityY;
    }

    this.ball.x = newBallX;
    this.ball.y = newBallY;
    return {x: Math.round(this.ball.x), y: Math.round(this.ball.y)};
  }

}
