import { Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports:  [PrismaModule],
  providers: [MatchService],
  controllers: [MatchController]
})
export class MatchModule {}
