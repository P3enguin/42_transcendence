import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { JwtStrategy } from 'src/auth/strategy';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  imports: [
    AuthModule,
    JwtModule.register({}),
  ],
  providers: [JwtStrategy, PrismaService],
  exports: [PrismaService],
}) 
export class PrismaModule {}
