import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { AchivementService } from 'src/achivement/achivement.service';
import { TitleService } from 'src/title/title.service';
import { RankService } from 'src/rank/rank.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: process.env.FRONTEND_HOST,
      credentials: true,
    },
  });

  const achiv = app.get<AchivementService>(AchivementService);
  const title = app.get<TitleService>(TitleService);
  const rank = app.get<RankService>(RankService);

  await achiv.fillAvhievememt();
  await title.fillTitles();
  await rank.fillRanks();

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.listen(8000);
}

bootstrap()