import { off } from 'process';
import { generate as generateID } from 'shortid';

export class Player {
  id: number;
  nickname: string;
  avatar: string;
  socketId: string;
  score: number;
  constructor(id: number, nickname: string, avatar: string, socketId?: string) {
    this.id = id;
    this.nickname = nickname;
    this.avatar = avatar;
    this.score = 0;
    this.socketId = socketId ? socketId : null;
  }
}

export enum GameType {
  'NORMAL',
  'RANKED',
  'TIME_ATTACK',
  'SURVIVAL',
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
  constructor(speed: number) {
    this.width = 700 / 8 / 5;
    this.height = this.width;
    this.diameter = this.width;
    this.radius = this.diameter / 2;
    this.x = 700 / 2 - this.radius;
    this.y = (700 * 1.4) / 2 - this.radius;
    this.speed = speed;
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
  players: [Player?, Player?]; // 0: bottom, 1: top
  winner: Player | null;
  looser: Player | null;
  paddle: [Paddle, Paddle];
  angleRad: number;
  ball: Ball;
  board: Board;
  type: GameType;
  rankId: number;
  spectator: Player[];
  createdAt: Date;
  updatedAt: Date;
  interval: NodeJS.Timeout;
  pausedInterval: NodeJS.Timeout;
  ruleInterval: NodeJS.Timeout;
  gameOn: boolean;
  paused: boolean;

  constructor(gameType: GameType, rankId: number) {
    this.id = generateID();
    this.players = [];
    this.winner = null;
    this.looser = null;
    this.spectator = [];
    this.type = gameType;
    this.rankId = 0;
    if (gameType === GameType.RANKED) this.rankId = rankId;
    this.angleRad = Math.PI / 4;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.board = new Board();
    this.paddle = [new Paddle('bottom'), new Paddle('top')];
    if (this.isSurvival()) this.ball = new Ball(10);
    else this.ball = new Ball(12);
    this.gameOn = false;
    this.interval = null;
    this.pausedInterval = null;
    this.paused = false;
  }

  isNormal(): boolean {
    return this.type.toString() === GameType[0];
  }

  isRanked(): boolean {
    return this.type.toString() === GameType[1];
  }

  isTimeAttack(): boolean {
    return this.type.toString() === GameType[2];
  }

  isSurvival(): boolean {
    return this.type.toString() === GameType[3];
  }

  isFull(): boolean {
    return this.players.length === 2;
  }

  getPlayersInfo() {
    return {
      p1: this.players[0].nickname,
      p1Avatar: this.players[0].avatar,
      pScore1: this.players[0].score,
      p2: this.players[1].nickname,
      p2Avatar: this.players[1].avatar,
      pScore2: this.players[1].score,
    };
  }

  isActive(): boolean {
    return (
      this.players.length === 2 &&
      this.players[0].socketId !== null &&
      this.players[1].socketId !== null
    );
  }

  connectPlayer(nickname: string, socketId: string): void {
    const player = this.isPlayer(nickname);
    if (player) player.socketId = socketId;
    clearInterval(this.pausedInterval);
    this.paused = false;
  }

  disconnectPlayer(nickname: string): void {
    this.paused = true;
    const player = this.isPlayer(nickname);
    if (player) player.socketId = null;
  }

  removePlayer(nickname: string) {
    this.players = this.players.filter((p) => p.nickname !== nickname) as [
      Player?,
      Player?,
    ];
    console.log(this.players);
  }

  isPlayer(nickname: string): Player | undefined {
    return this.players.find((p) => p.nickname === nickname);
  }

  addSpectator(spectator: Player): void {
    this.spectator.push(spectator);
  }

  movePaddle(player: Player, x: number): void {
    this.paddle[this.players.indexOf(player)].updatePosition(x);
  }

  checkWallCollision(): void {
    if (this.ball.newX - this.ball.radius <= this.board.offset) {
      const m = this.ball.velocityY / this.ball.velocityX;
      const b = this.ball.newY - m * this.ball.newX;
      this.ball.newX = this.board.offset + this.ball.radius;
      this.ball.newY = m * this.ball.newX + b;
      this.ball.velocityX = Math.abs(this.ball.velocityX);
    } else if (
      this.ball.newX + this.ball.radius >=
      this.board.width - this.board.offset
    ) {
      const m = this.ball.velocityY / this.ball.velocityX;
      const b = this.ball.newY - m * this.ball.newX;
      this.ball.newX = this.board.width - this.board.offset - this.ball.radius;
      this.ball.newY = m * this.ball.newX + b;
      this.ball.velocityX = -Math.abs(this.ball.velocityX);
    }
  }

  isCollision(paddle: Paddle) {
    let collidePoint = this.ball.newX - (paddle.x + paddle.width / 2);
    collidePoint = collidePoint / (paddle.width / 2);
    const angle = collidePoint * this.angleRad;
    let direction = this.ball.newY < this.board.height / 2 ? 1 : -1;
    if (this.isSurvival()) this.ball.speed += 0.1;
    this.ball.velocityX = this.ball.speed * Math.sin(angle);
    this.ball.velocityY = direction * this.ball.speed * Math.cos(angle);
  }

  checkPaddleCollision(): void {
    if (this.ball.newY + this.ball.radius >= this.paddle[0].y) {
      if (
        this.ball.newX + this.ball.radius >=
          this.paddle[0].x - this.ball.radius &&
        this.ball.newX - this.ball.radius <=
          this.paddle[0].x + this.paddle[0].width + this.ball.radius
      ) {
        if (this.ball.velocityX) {
          const m = this.ball.velocityY / this.ball.velocityX;
          const b = this.ball.newY - m * this.ball.newX;
          this.ball.newY = this.paddle[0].y - this.ball.radius;
          this.ball.newX = (this.ball.newY - b) / m;
        } else this.ball.newY = this.paddle[0].y - this.ball.radius;
        this.isCollision(this.paddle[0]);
      }
    } else if (
      this.ball.newY - this.ball.radius <=
      this.paddle[1].y + this.paddle[1].height
    ) {
      if (
        this.ball.newX + this.ball.radius >=
          this.paddle[1].x - this.ball.radius &&
        this.ball.newX - this.ball.radius <=
          this.paddle[1].x + this.paddle[1].width + this.ball.radius
      ) {
        if (this.ball.velocityX) {
          const m = this.ball.velocityY / this.ball.velocityX;
          const b = this.ball.newY - m * this.ball.newX;
          this.ball.newY =
            this.paddle[1].y + this.paddle[1].height + this.ball.radius;
          this.ball.newX = (this.ball.newY - b) / m;
        } else
          this.ball.newY =
            this.paddle[1].y + this.paddle[1].height + this.ball.radius;
        this.isCollision(this.paddle[1]);
      }
    }
  }

  resetBall() {
    if (this.isSurvival()) this.ball.speed = 10;
    this.ball.newY = this.board.height / 2;
    let direction = this.ball.velocityY < 0 ? 1 : -1;
    this.ball.velocityY = direction * this.ball.speed * Math.cos(this.angleRad);
    this.ball.velocityX = this.ball.speed * Math.sin(this.angleRad);
    this.pauseGame(1);
  }

  checkNewScore(): boolean {
    if (this.ball.newY - this.ball.radius <= this.board.offset) {
      this.players[0].score++;
      this.resetBall();
      return true;
    }
    if (
      this.ball.newY + this.ball.radius >=
      this.board.height - this.board.offset
    ) {
      this.players[1].score++;
      this.resetBall();
      return true;
    }
    return false;
  }

  getScore(): { [key: string]: number | string } {
    return {
      gameId: this.id,
      [this.players[0].nickname]: this.players[0].score,
      [this.players[1].nickname]: this.players[1].score,
    };
  }

  getBallPos(): { x: number; y: number } {
    return { x: this.ball.x, y: this.ball.y };
  }

  getPaddlePos(): { top: { x: number }; bottom: { x: number } } {
    return {
      top: { x: this.paddle[1].x },
      bottom: { x: this.paddle[0].x },
    };
  }

  getAllinfo() {
    const ball = { x: this.ball.x, y: this.ball.y };
    const paddle = { top: this.paddle[1].x, bottom: this.paddle[0].x };
    const score = { top: this.players[1].score, bottom: this.players[0].score };
    return { ball, paddle, score };
  }

  start(): void {
    setTimeout(() => {
      this.paused = false;
    }, 1000);
    this.gameOn = true;
    this.createdAt = new Date();
  }

  End(): void {
    this.gameOn = false;
  }

  playerLeft(nickname: string): void {
    // this.disconnectPlayer(nickname);
    // clearInterval(this.interval);
    // this.pausedInterval = setTimeout(() => {
    const winner = this.players.find((p) => p.nickname !== nickname);
    if (winner) {
      winner.score = 5;
      this.winner = winner;
      this.looser = this.players.find((p) => p.nickname === nickname);
    }
    this.paused = false;
    // }, 5000);
  }

  checkWin(): boolean {
    if (this.isNormal() || this.isRanked() || this.isSurvival())
      return this.players.some((p) => p.score === 5);
    else if (this.isTimeAttack()) {
      const time = new Date().getTime() - this.createdAt.getTime();
      // check if a player has score higher than the other

      return (
        time > 60000 &&
        this.players.some(
          (player) =>
            player.score > this.players[1 - this.players.indexOf(player)].score,
        )
      );
    }
  }

  getWinner(): Player {
    //return the palayer with higher score
    return this.players.reduce((p1, p2) => (p1.score > p2.score ? p1 : p2));
  }

  getLooser(): Player {
    return this.players.reduce((p1, p2) => (p1.score < p2.score ? p1 : p2));
  }

  pauseGame(time: number): void {
    this.paused = true;
    setTimeout(() => {
      this.paused = false;
    }, time * 1000);
  }

  getGameRules() {
    if (this.isNormal()) {
      return {
        type: 'Normal',
        description: 'The first player to reach 5 points wins',
        effects: 'N/A',
        time: 'N/A',
      };
    } else if (this.isRanked()) {
      return {
        type: 'Ranked',
        description: 'The first player to reach 5 points wins',
        effects: 'N/A',
        time: 'N/A',
      };
    }
    if (this.isTimeAttack()) {
      return {
        type: 'Time Attack',
        description: 'The first player score at least 1 point in 1 minute wins',
        effects: 'N/A',
        time: '1 minute',
      };
    }
    if (this.isSurvival()) {
      return {
        type: 'Survival',
        description: 'The first player to reach 5 points wins',
        effects: 'Ball speed increases every time it hits a paddle',
        time: 'N/A',
      };
    }
  }
}
