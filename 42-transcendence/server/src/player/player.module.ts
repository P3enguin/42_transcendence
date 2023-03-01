import { Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { PlayerController } from './player.controller';

@Module({
  providers: [PlayerService],
  controllers: [PlayerController]
})
export class PlayerModule {}
