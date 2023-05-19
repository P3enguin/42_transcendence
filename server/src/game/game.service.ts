import { Injectable, Logger } from '@nestjs/common';
import { Game, GameType, Player } from './interfaces';
import { PrismaService } from 'src/prisma/prisma.service';
import { Player as PlayerModel } from '@prisma/client';

@Injectable()
export class GameService {
  games = new Map<string, Game>();
  players = new Map<string, Player>();

  constructor(private prisma: PrismaService) {}

  inviteGame(player1: Player, player2: Player, gametype: GameType) {
    const game = this.createGame(gametype);
    game.players.push(player1);
    game.players.push(player2);
    return game.id;
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
    if (game && game.isPlayer(nickname)) {
      return game;
    }
    return null;
  }

  // removePlayerFromGame(id: string, nickname: string) {
  //   const game = this.games.get(id);
  //   if (game) {
  //     clearInterval(game.inteval);
  //     if (!game.players.length) {
  //       this.games.delete(id);
  //       return;
  //     }
  //   }
  //   this.games.set(id, game);
  // }

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
      if (game.isActive()) activeGames.push(this.getLiveGame(game));
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
  }

  getRequiredLevelXP(level: number) {
    return Math.floor(100 * Math.pow(1.6, level - 1));
  }

  getLevelFromXP(XP: number) {
    const requiredXP = 100;
    let level = Math.floor(Math.log(XP / requiredXP) / Math.log(1.6)) + 2;
    if (XP < requiredXP) level = 1;
    return level;
  }

  calculateWinnerXP(
    level: number,
    winnerscore: number,
    looserscore: number,
  ): bigint {
    const requiredXP = this.getRequiredLevelXP(level);
    const EarnedXP = Math.round(requiredXP * 0.7);
    const bonusXP = (winnerscore - looserscore) * Math.round(requiredXP * 0.02);
    return BigInt(Math.round((EarnedXP + bonusXP) / level));
  }

  calculateLooserXP(level: number, looserscore): bigint {
    const requiredXP = this.getRequiredLevelXP(level);
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

    const winnerLevel = this.getLevelFromXP(Number(winner.status.XP));
    looser.status.XP += this.calculateLooserXP(
      looser.status.level,
      LooserScore,
    );
    const looserLevel = this.getLevelFromXP(Number(looser.status.XP));
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

  async rankUp(__winner, __looser) {
    let winnerRank = __winner.status.rank.rank;
    let looserRank = __looser.status.rank.rank;
    let winner_RP = __winner.status.rank.current_points;
    let looser_RP = __looser.status.rank.current_points;
    winner_RP += 10 / (winnerRank.id ? winnerRank.id : 1);
    looser_RP -= looserRank.id;
    if (looser_RP < 0) looser_RP = 0;
    if (winner_RP > winnerRank.points) winnerRank.id++;
    if (looser_RP < looserRank.points) looserRank.id--;
    await this.prisma.rank_status.update({
      where: {
        statusId: __winner.status.id,
      },
      data: {
        current_points: winner_RP,
        rankId: winnerRank.id,
      },
    });
    await this.prisma.rank_status.update({
      where: {
        statusId: __looser.status.id,
      },
      data: {
        current_points: looser_RP,
        rankId: looserRank.id,
      },
    });
  }

  async saveGame(game: Game) {
    const __winner = game.getWinner();
    const __looser = game.getLooser();

    await this.prisma.match.create({
      data: {
        type: game.type.toString(),
        winner: __winner.id,
        loser: __looser.id,
        score: __winner.score + '-' + __looser.score,
      },
    });
    const winner = await this.prisma.player.findUnique({
      where: {
        id: __winner.id,
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
        id: __looser.id,
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

    await this.levelUp(winner, __winner.score, looser, __looser.score);
    if (game.type.toString() === 'RANKED') await this.rankUp(winner, looser);
    this.deleteGame(game.id);
  }
}
