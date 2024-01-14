import { Module } from '@nestjs/common';
import { SpeakerService } from './speaker.service';
import { SpeakerController } from './speaker.controller';
import { ChatGptApiModule } from 'src/modules/openai/chat-gpt-api/chat-gpt-api.module';
import { TextToSpeechModule } from 'src/modules/openai/text-to-speech/text-to-speech.module';
import { AudioGateway } from './audio-gateway-websocket';

@Module({
  imports: [TextToSpeechModule, ChatGptApiModule],
  providers: [SpeakerService, AudioGateway],
  controllers: [SpeakerController],
})
export class SpeakerModule {}
