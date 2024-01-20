import { Module } from '@nestjs/common';
import { ChatSecurityController } from './chat-security.controller';
import { ChatSecurityService } from './chat-security.service';

@Module({
  controllers: [ChatSecurityController],
  providers: [ChatSecurityService]
})
export class ChatSecurityModule {}
