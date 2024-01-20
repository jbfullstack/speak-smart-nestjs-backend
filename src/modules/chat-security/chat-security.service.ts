import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ChatHistoryManager } from '../openai/chat-gpt-api/model/chat-history-manager';
import { existsSync, readFileSync } from 'fs';
import * as path from 'path';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { ChatSecuritySession } from './chat-security-session';

const DEFAULT_TEMPERATURE = 1;
const DEFAULT_MODEL = 'gpt-3.5-turbo';

@Injectable()
export class ChatSecurityService {
  private readonly logger: Logger = new Logger(ChatSecurityService.name);
  private readonly chatSecurityHistory: ChatSecuritySession;
  private readonly chat: ChatOpenAI;

  constructor() {
    this.chatSecurityHistory = new ChatSecuritySession(this.loadPromptFile());
    this.chat = new ChatOpenAI({
      temperature: DEFAULT_TEMPERATURE,
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: DEFAULT_MODEL,
    });
  }

  private loadPromptFile(): string {
    let filePath = path.join(
      process.cwd(),
      'src',
      'modules',
      'chat-security',
      'prompt',
      'security.prompt',
    );

    try {
      return readFileSync(filePath, 'utf8');
    } catch (error) {
      throw new InternalServerErrorException(
        `ChatSecurityService can't load security prompt: ${error}`,
      );
    }
  }

  async controleMessage(message: string): Promise<boolean> {
    this.chatSecurityHistory.addSecurityControlMessage(message);
    const result = await this.chat.predictMessages(
      this.chatSecurityHistory.chatHistory,
    );

    const aiMessage = result.content;
    this.logger.log(`Security control aiMessage: ${aiMessage}`);
    if (aiMessage === 'OK') {
      return true;
    } else {
      this.logger.warn(`Security control failed: ${aiMessage}`);
      return false;
    }
  }
}
