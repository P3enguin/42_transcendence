import { Global, Module } from '@nestjs/common';
import { AchivementService } from './achivement.service';
import { AchivementController } from './achivement.controller';


@Module({
  providers: [AchivementService],
  controllers: [AchivementController]
})
export class AchivementModule {}
