import { Module } from '@nestjs/common';
import { ChatPersonalityService } from './chat-personality.service';
import { ChatPersonalityController } from './chat-personality.controller';

@Module({
  providers: [ChatPersonalityService],
  exports: [ChatPersonalityService],
  controllers: [ChatPersonalityController],
})
export class ChatPersonalityModule {}
