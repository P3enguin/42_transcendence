import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ChatGateway } from './chat.gateway';
import { JwtGuard } from 'src/auth/guard';
@Module({
  providers: [ ChatService, JwtService, JwtGuard, PrismaService, ChatGateway],
  controllers: [ChatController]
})
export class ChatModule {}
