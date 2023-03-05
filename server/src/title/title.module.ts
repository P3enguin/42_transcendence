import { Module } from '@nestjs/common';
import { TitleService } from './title.service';
import { TitleController } from './title.controller';

@Module({
  providers: [TitleService],
  controllers: [TitleController],
  exports: [TitleService],
})
export class TitleModule {}
