import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { authModule } from './auth/auth.module';
import { authController } from './auth/app.controller';
import { Prisma } from '@prisma/client';
import { PrismaModule } from 'prisma/prisma.module';



@Module({
  imports: [ConfigModule.forRoot(),authModule,PrismaModule],
  controllers: [authController],
})
export class AppModule {}
