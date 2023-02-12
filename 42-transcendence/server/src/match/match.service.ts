import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MatchService {
	constructor(private prisma: PrismaService) {

	}
	loadGame() {
		//history : 
		return 'leading Game . . .'
	}

	saveGame() {
		// add game :
		return 'saving Game . . .'
	}
}
