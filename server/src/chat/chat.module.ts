import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports:  [PrismaService],
  providers: [ChatService],
  controllers: [ChatController]
})
export class ChatModule {}
