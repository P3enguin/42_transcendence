import { Logger, Module } from '@nestjs/common';
import { RankService } from './rank.service';
import { RankController } from './rank.controller';

@Module({
  providers: [RankService, Logger],
  controllers: [RankController],
  exports: [RankService],
})
export class RankModule {}
