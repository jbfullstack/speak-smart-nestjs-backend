import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SpeakerModule } from './modules/speaker/speaker.module';
import { SpeechToTextService } from './modules/openai/speech-to-text/speech-to-text.service';
import { ChatManagerModule } from './modules/chat-manager/chat-manager.module';
import { ChatSecurityModule } from './modules/chat-security/chat-security.module';
import { ChatOpenaiConnectorModule } from './modules/openai/chat-openai-connector/chat-openai-connector.module';

@Module({
  imports: [ConfigModule.forRoot(), SpeakerModule, ChatManagerModule, ChatSecurityModule, ChatOpenaiConnectorModule],
  controllers: [AppController],
  providers: [AppService, SpeechToTextService],
})
export class AppModule {}
