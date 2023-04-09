import { Controller } from '@nestjs/common';
import { RankService } from './rank.service';

@Controller('rank')
export class RankController {
    constructor(
        private rank: RankService,
    ) {}

    @Pos('ranks')

}
