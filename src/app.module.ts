import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SpeakerModule } from './modules/speaker/speaker.module';
import { SpeechToTextService } from './modules/openai/speech-to-text/speech-to-text.service';
import { ChatManagerModule } from './modules/chat/chat-manager/chat-manager.module';
import { ChatSecurityModule } from './modules/chat/chat-security/chat-security.module';
import { ChatOpenaiConnectorModule } from './modules/openai/chat-openai-connector/chat-openai-connector.module';
import { ChatPersonalityModule } from './modules/chat/chat-personality/chat-personality.module';

@Module({
  imports: [ConfigModule.forRoot(), SpeakerModule, ChatManagerModule, ChatPersonalityModule],
  controllers: [AppController],
  providers: [AppService, SpeechToTextService],
})
export class AppModule {}
