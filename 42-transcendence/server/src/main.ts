import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  /* making the pipe validation global :
    whitelist:true  to get rid of uneccesarry params that 
    has been passed to the server */ 
  app.useGlobalPipes(new ValidationPipe(
    {
      whitelist:true,
    }
  ));
  await app.listen(8000);

} 
bootstrap();
