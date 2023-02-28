import { Global, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  imports: [
    AuthModule,
  ],
  providers: [PrismaService],
  exports: [PrismaService],
}) 
export class PrismaModule {}
