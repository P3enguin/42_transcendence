import { Global, Module } from '@nestjs/common';
import { AchivementService } from './achivement.service';
import { AchivementController } from './achivement.controller';

@Global()
@Module({
  providers: [AchivementService],
  controllers: [AchivementController],
  exports: [AchivementService],
})
export class AchivementModule {}
