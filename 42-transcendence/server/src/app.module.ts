import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { authModule } from './auth/auth.module';
import { authController } from './auth/app.controller';



@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [authController],
})
export class AppModule {}
