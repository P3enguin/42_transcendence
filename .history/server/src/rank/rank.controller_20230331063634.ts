import { Controller, Post } from '@nestjs/common';
import { RankService } from './rank.service';

@Controller('rank')
export class RankController {
    constructor(
        private rank: RankService,
    ) {}

    @Post('ranks')
    async fillRanks {
        return this.ranks.fillRanks();
    }
}
