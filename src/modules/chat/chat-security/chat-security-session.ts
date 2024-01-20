import { Logger } from '@nestjs/common';
import {
  HumanMessage,
  AIMessage,
  SystemMessage,
  BaseMessage,
} from 'langchain/schema';
import { v4 as uuidv4 } from 'uuid';

export class ChatSecuritySession {
  private readonly logger: Logger = new Logger(ChatSecuritySession.name);
  readonly uuid: string;
  readonly sessionName: string = 'security-session';
  chatHistory: BaseMessage[];

  constructor(systemMessage: string) {
    this.uuid = uuidv4();
    this.chatHistory = [];

    this.addSystemMessage(systemMessage);
  }

  private addSystemMessage(message: string) {
    this.chatHistory.push(new SystemMessage(message));
  }

  addSecurityControlMessage(message: string) {
    this.logger.log(`ChatSecuritySession message: ${message}`);
    this.chatHistory = this.chatHistory.slice(0, 1);

    this.chatHistory.map((baseMessage) =>
      this.logger.log(`baseMessage ${JSON.stringify(baseMessage)}`),
    );
    this.chatHistory.push(new HumanMessage(message));
  }
}
