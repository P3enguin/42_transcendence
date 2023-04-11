import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AchivementModule } from 'src/achivement/achivement.module';
import { RankModule } from 'src/rank/rank.module';
import { RankService } from 'src/rank/rank.service';
import { TitleModule } from 'src/title/title.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy';
import { Auth42Strategy } from './strategy/auth.strategy';
import { GoogleStrategy } from './strategy/auth.strategy.google';
@Module({
  imports: [JwtModule.register({}), AchivementModule, TitleModule, RankModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, Auth42Strategy, GoogleStrategy],
  exports: [AuthService],
})
export class AuthModule {}
