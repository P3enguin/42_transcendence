import { Injectable, Logger } from '@nestjs/common';
import { Game, GameType, Player } from './interfaces';
import { PrismaService } from 'src/prisma/prisma.service';
import { Player as PlayerModel } from '@prisma/client';

@Injectable()
export class GameService {
  games = new Map<string, Game>();
  players = new Map<string, Player>();

  constructor(private prisma: PrismaService) {
    // const game = new Game(GameType.RANKED);
    // game.players[0] = new Player(1, '4reha', 'default.png', 'Zzz');
    // game.players[0].score = 5;
    // game.players[1] = new Player(2, 'ar.eha', 'default.png', 'Zzz');
    // game.players[1].score = 0;
    // this.games.set(game.id, game);
    // this.saveGame(game);
  }

  joinGame(player: Player, gametype: GameType) {
    const game = this.getAvailableGame(gametype);
    if (game) {
      game.players.push(player);
      this.players.set(player.nickname, player);
      return game.id;
    } else {
      const game = this.createGame(gametype);
      game.players.push(player);
      return game.id;
    }
  }

  createGame(gametype: GameType) {
    const game = new Game(gametype);
    this.games.set(game.id, game);
    return game;
  }

  getAvailableGame(gametype: GameType) {
    const availableGames = Array.from(this.games.values()).filter((game) => {
      if (game) return game.players.length < 2 && game.type === gametype;
    });
    return availableGames[0];
  }

  getMyGame(id: string, nickname: string) {
    const game = this.games.get(id);
    if (game && game.players.find((player) => player.nickname === nickname)) {
      return game;
    }
    return null;
  }

  removePlayerFromGame(id: string, nickname: string) {
    const game = this.games.get(id);
    if (game) {
      clearInterval(game.inteval);
      if (!game.players.length) {
        this.games.delete(id);
        return;
      }
    }
    this.games.set(id, game);
  }

  getActiveGame(id: string) {
    const game = this.games.get(id);
    if (game && game.isActive()) {
      return game;
    }
    return null;
  }

  getLiveGame(game: Game) {
    return {
      id: game.id,
      players: [
        {
          id: game.players[0].id,
          nickname: game.players[0].nickname,
          avatar: game.players[0].avatar,
          score: game.players[0].score,
        },
        {
          id: game.players[1].id,
          nickname: game.players[1].nickname,
          avatar: game.players[1].avatar,
          score: game.players[1].score,
        },
      ],
      type: game.type,
      createdAt: game.createdAt,
      updatedAt: game.updatedAt,
    };
  }

  getLiveGames() {
    let activeGames = [];
    Array.from(this.games.values()).forEach((game) => {
      if (game && game.players.length === 2) {
        activeGames.push(this.getLiveGame(game));
      }
    });
    return activeGames;
  }

  getGameById(id: string) {
    const game = this.games.get(id);
    return game;
  }

  playerConnect(id: string, socket: string, nickname: string) {
    const game = this.games.get(id);
    if (game) {
      if (game.players[0] && game.players[0].nickname === nickname) {
        game.players[0].socketId = socket;
      } else if (game.players[1] && game.players[1].nickname === nickname) {
        game.players[1].socketId = socket;
      }
    }
    this.games.set(id, game);
  }

  deleteGame(id: string) {
    this.games.delete(id);
    return 'This action deletes a game';
  }

  getRequiedLevelXP(level: number): number {
    let XP = 100;
    for (let i = 1; i < level; i++) {
      // 160% from the previous level
      XP = Math.round(XP * 1.6);
    }
    return XP;
  }

  getLevelFromXP(XP: bigint): number {
    let level = 1;
    let requiredXP = 100;
    while (XP > requiredXP) {
      level++;
      requiredXP = this.getRequiedLevelXP(level);
    }
    return level;
  }

  calculateWinnerXP(
    level: number,
    winnerscore: number,
    looserscore: number,
  ): bigint {
    const requiredXP = this.getRequiedLevelXP(level);
    const EarnedXP = Math.round(requiredXP * 0.7);
    const bonusXP = (winnerscore - looserscore) * Math.round(requiredXP * 0.02);
    return BigInt(Math.round((EarnedXP + bonusXP) / level));
  }

  calculateLooserXP(level: number, looserscore): bigint {
    const requiredXP = this.getRequiedLevelXP(level);
    const EarnedXP = Math.round(requiredXP * 0.3);
    const bonusXP = looserscore * Math.round(requiredXP * 0.01);

    return BigInt(Math.round((EarnedXP + bonusXP) / level));
  }

  async levelUp(winner, winnerScore, looser, LooserScore) {
    winner.status.XP += this.calculateWinnerXP(
      winner.status.level,
      winnerScore,
      LooserScore,
    );
    const winnerLevel = this.getLevelFromXP(winner.status.XP);
    looser.status.XP += this.calculateLooserXP(
      looser.status.level,
      LooserScore,
    );
    const looserLevel = this.getLevelFromXP(looser.status.XP);

    await this.prisma.status.update({
      where: {
        id: winner.status.id,
      },
      data: {
        level: winnerLevel,
        XP: winner.status.XP,
      },
    });
    await this.prisma.status.update({
      where: {
        id: looser.status.id,
      },
      data: {
        level: looserLevel,
        XP: looser.status.XP,
      },
    });
  }

  async rankUp(_winner, _looser) {
    let winnerRank = _winner.status.rank.rank;
    let looserRank = _looser.status.rank.rank;
    let winner_RP = _winner.status.rank.current_points;
    let looser_RP = _looser.status.rank.current_points;
    winner_RP += 10 / (winnerRank.id ? winnerRank.id : 1);
    looser_RP -= looserRank.id;
    if (looser_RP < 0) looser_RP = 0;
    if (winner_RP > winnerRank.points) winnerRank.id++;
    if (looser_RP < looserRank.points) looserRank.id--;
    Logger.log(winner_RP);
    await this.prisma.rank_status.update({
      where: {
        statusId: _winner.status.id,
      },
      data: {
        current_points: winner_RP,
        rankId: winnerRank.id,
      },
    });
    await this.prisma.rank_status.update({
      where: {
        statusId: _looser.status.id,
      },
      data: {
        current_points: looser_RP,
        rankId: looserRank.id,
      },
    });
  }

  async saveGame(game: Game) {
    const _winner = game.getWinner();
    const _looser = game.getLooser();

    await this.prisma.match.create({
      data: {
        type: game.type.toString(),
        winner: _winner.id,
        loser: _looser.id,
        score: [_winner.score, _looser.score].toString(),
      },
    });
    const winner = await this.prisma.player.findUnique({
      where: {
        id: _winner.id,
      },
      include: {
        status: {
          include: {
            rank: {
              include: {
                rank: true,
              },
            },
          },
        },
      },
    });
    const looser = await this.prisma.player.findUnique({
      where: {
        id: _looser.id,
      },
      include: {
        status: {
          include: {
            rank: {
              include: {
                rank: true,
              },
            },
          },
        },
      },
    });

    await this.levelUp(winner, _winner.score, looser, _looser.score);
    if (game.type.toString() === 'RANKED') await this.rankUp(winner, looser);
    this.deleteGame(game.id);
  }
}
