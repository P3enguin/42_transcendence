import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MatchDto } from './dto/match.dto';

@Injectable()
export class MatchService {
	constructor(private prisma: PrismaService) {}

	saveGame(dto: MatchDto) {
		// Add Game : 
		return 'saving Game . . '
	}

	loadGame() {
		// Matches List
		return 'Loading Games . . .'
	}

	loadGamebyId() {
		return 'loading a single Game . . .'
	}
}
