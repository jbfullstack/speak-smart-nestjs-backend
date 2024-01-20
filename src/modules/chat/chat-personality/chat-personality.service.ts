import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { readFileSync } from 'fs';
import * as path from 'path';
import { ChatOpenaiConnectorService } from 'src/modules/openai/chat-openai-connector/chat-openai-connector.service';
import { ChatSingleSession } from '../chat-single-session';
import { ChatPersonality } from './model/chat-personality';

@Injectable()
export class ChatPersonalityService {
  private readonly logger: Logger = new Logger(ChatPersonalityService.name);
  private chatPersonalityHistory: ChatSingleSession;
  private readonly chatGptConnector: ChatOpenaiConnectorService;

  constructor() {
    this.chatGptConnector = new ChatOpenaiConnectorService();
  }

  initChatWithPersonality(personality: ChatPersonality) {
    this.chatPersonalityHistory = new ChatSingleSession(
      this.loadPromptFile(personality.description),
      'personality-session',
    );
  }

  private loadPromptFile(personality: string): string {
    let filePath = path.join(
      process.cwd(),
      'src',
      'modules',
      'chat',
      'chat-personality',
      'prompt',
      'personality.prompt',
    );

    try {
      const prompt = readFileSync(filePath, 'utf8');
      const resultPrompt = prompt.replace(/##PERSONALITY##/g, personality);
      return resultPrompt;
    } catch (error) {
      throw new InternalServerErrorException(
        `ChatSecurityService can't load security prompt: ${error}`,
      );
    }
  }

  async rewriteWithPersonality(message: string) {
    this.chatPersonalityHistory.addSingleMessage(message);
    const result = await this.chatGptConnector.predictMessages(
      this.chatPersonalityHistory.chatHistory,
    );

    const aiMessage = result.content;
    return aiMessage;
  }
}
