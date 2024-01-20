import { Module } from '@nestjs/common';
import { ChatManagerController } from './chat-manager.controller';
import { ChatManagerService } from './chat-manager.service';

@Module({
  controllers: [ChatManagerController],
  providers: [ChatManagerService]
})
export class ChatManagerModule {}
