import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { readFileSync } from 'fs';
import * as path from 'path';
import { ChatSecuritySession } from './chat-security-session';
import { ChatOpenaiConnectorService } from '../../openai/chat-openai-connector/chat-openai-connector.service';

@Injectable()
export class ChatSecurityService {
  private readonly logger: Logger = new Logger(ChatSecurityService.name);
  private readonly chatSecurityHistory: ChatSecuritySession;
  private readonly chatGptConnector: ChatOpenaiConnectorService;

  constructor() {
    this.chatSecurityHistory = new ChatSecuritySession(this.loadPromptFile());
    this.chatGptConnector = new ChatOpenaiConnectorService();
  }

  private loadPromptFile(): string {
    let filePath = path.join(
      process.cwd(),
      'src',
      'modules',
      'chat',
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
    const result = await this.chatGptConnector.predictMessages(
      this.chatSecurityHistory.chatHistory,
    );

    const aiMessage = result.content;
    this.logger.warn(`Security control aiMessage: ${aiMessage}`);
    if (aiMessage === 'OK') {
      return true;
    } else {
      this.logger.warn(`Security control failed: ${aiMessage}`);
      return false;
    }
  }
}
