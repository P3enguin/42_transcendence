import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/app.controller';
import { AuthService } from './auth/auth.service';




@Module({
  imports: [ConfigModule.forRoot(),AuthModule],
  controllers: [AuthController],
  providers:[AuthService]
})
export class AppModule {}
