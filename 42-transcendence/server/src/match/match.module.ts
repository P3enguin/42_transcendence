import { Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';

@Module({
  providers: [MatchService],
  controllers: [MatchController]
})
export class MatchModule {}
