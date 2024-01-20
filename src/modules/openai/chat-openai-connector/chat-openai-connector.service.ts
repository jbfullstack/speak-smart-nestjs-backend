import { Injectable, Logger } from '@nestjs/common';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { BaseMessage } from 'langchain/schema';

const DEFAULT_TEMPERATURE = 1;
const DEFAULT_MODEL = 'gpt-3.5-turbo';

@Injectable()
export class ChatOpenaiConnectorService {
  private readonly logger: Logger = new Logger(ChatOpenaiConnectorService.name);
  private readonly chat: ChatOpenAI;

  constructor() {
    this.chat = new ChatOpenAI({
      temperature: DEFAULT_TEMPERATURE,
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: DEFAULT_MODEL,
    });
  }

  async predictMessages(messages: BaseMessage[]) {
    return this.chat.predictMessages(messages);
  }
}
