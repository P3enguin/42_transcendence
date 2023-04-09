import { Module } from '@nestjs/common';
import { RankService } from './rank.service';
import { RankController } from './rank.controller';

@Module({
  providers: [RankService],
  controllers: [RankController],
  exports: [RankService],
})
export class RankModule {}
