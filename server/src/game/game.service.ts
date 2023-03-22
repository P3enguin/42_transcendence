import { Injectable } from '@nestjs/common';
import { Game } from './interfaces';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GameService {
  games = new Map<string, Game>();

  constructor(private prisma: PrismaService) {}

  createGame() {
    const id = randomUUID();
    this.games.set(id, {
      id: id,
      players: [],
      score: [0,0],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return id;
  }

  getAvailableGame() {
    const availableGames = Array.from(this.games.values()).filter(
      (game) => game.players.length < 2,
    );
    return availableGames[0].id;
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
        winner: game.score[0] > game.score[1] ? game.players[0].id : game.players[1].id,
        loser: game.score[0] > game.score[1] ? game.players[1].id : game.players[0].id,
        score: game.score.sort().toString(),
      },
    });
  }
}
