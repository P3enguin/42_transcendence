import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RankService {
    constructor(
        private prisma: PrismaService,
    ) {}

    async fillRanks
}
