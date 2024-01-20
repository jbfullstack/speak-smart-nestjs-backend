import { Module } from '@nestjs/common';
import { SpeakerService } from './speaker.service';
import { SpeakerController } from './speaker.controller';
import { ChatGptApiModule } from 'src/modules/openai/chat-gpt-api/chat-gpt-api.module';
import { TextToSpeechModule } from 'src/modules/openai/text-to-speech/text-to-speech.module';
import { AudioGateway } from './audio-gateway-websocket';
import { ChatSecurityModule } from '../chat/chat-security/chat-security.module';
import { ChatPersonalityModule } from '../chat/chat-personality/chat-personality.module';

@Module({
  imports: [
    TextToSpeechModule,
    ChatGptApiModule,
    ChatSecurityModule,
    ChatPersonalityModule,
  ],
  providers: [SpeakerService, AudioGateway],
  controllers: [SpeakerController],
})
export class SpeakerModule {}
