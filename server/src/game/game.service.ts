import { Injectable } from '@nestjs/common';
import { Game, Player } from './interfaces';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GameService {
  games = new Map<string, Game>();

  constructor(private prisma: PrismaService) {}

  joinGame(player: Player) {
    const game = this.getAvailableGame();
    if (game) {
      game.players.push(player);
      return game.id;
    } else {
      const id = this.createGame();
      this.games.get(id).players.push(player);
      return id;
    }
  }

  getGame(id: string) {
    const game = this.games.get(id);
    return game;
  }

  createGame() {
    const id = randomUUID();
    this.games.set(id, {
      id: id,
      players: [],
      score: [0, 0],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return id;
  }

  getAvailableGame() {
    const availableGames = Array.from(this.games.values()).filter(
      (game) => game.players.length < 2,
    );
    return availableGames[0];
  }

  getActiveGames() {
    const activeGames = Array.from(this.games.values()).filter(
      (game) => game.players.length === 2,
    );
    return activeGames;
  }

  getGameById(id: string) {
    const game = this.games.get(id);
    return game;
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
          game.score[0] > game.score[1]
            ? game.players[0].id
            : game.players[1].id,
        loser:
          game.score[0] > game.score[1]
            ? game.players[1].id
            : game.players[0].id,
        score: game.score.sort().toString(),
      },
    });
  }
}
