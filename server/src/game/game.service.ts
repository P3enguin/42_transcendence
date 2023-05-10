import { Injectable } from '@nestjs/common';
import { Game, GameType, Player } from './interfaces';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GameService {
  games = new Map<string, Game>();
  players = new Map<string, Player>();

  constructor(private prisma: PrismaService) {}

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
      game.removePlayer(nickname);
      if (!game.players.length) {
        console.log('deleting game');
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

  getLiveGames() {
    const activeGames = Array.from(this.games.values()).filter(
      (game) => game.players.length === 2,
    );
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

  saveGame(id: string) {
    const game = this.games.get(id);
    this.prisma.match.create({
      data: {
        winner:
          game.players[0].score > game.players[1].score
            ? game.players[0].id
            : game.players[1].id,
        loser:
          game.players[0].score < game.players[1].score
            ? game.players[0].id
            : game.players[1].id,
        score: [game.players[0].score, game.players[1].score].sort().toString(),
      },
    });
  }
}
