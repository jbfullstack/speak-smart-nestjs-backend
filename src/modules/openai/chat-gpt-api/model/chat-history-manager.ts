import { ChatSession } from './chat-session';
import {
  ForbiddenException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

export class ChatHistoryManager {
  private readonly logger: Logger = new Logger(ChatHistoryManager.name);
  private readonly chatSessions: ChatSession[] = [];
  private readonly MAX_SESSION_BY_USER = parseInt(
    process.env.MAX_SESSION_BY_USER,
    10,
  );

  createChatSession(
    userName: string,
    sessionName: string,
    systemMessage?: string,
  ): ChatSession {
    const userSessions = this.chatSessions.filter(
      (session) => session.userName === userName,
    );

    if (userSessions.length >= this.MAX_SESSION_BY_USER) {
      throw new UnauthorizedException('Maximum session limit reached for user');
    }

    const newSession = new ChatSession(userName, sessionName, systemMessage);
    this.chatSessions.push(newSession);
    return newSession;
  }

  getChatSession(uuid: string, username: string): ChatSession {
    const foundSession = this.chatSessions.find(
      (session) => session.uuid === uuid,
    );
    if (!foundSession) {
      this.logger.warn(`ChatSession ${uuid} does not exist`);
      throw new NotFoundException(`ChatSession ${uuid} does not exist`);
    }

    if (foundSession.userName !== username) {
      this.logger.warn(`ChatSession ${uuid} is not owned by ${username}`);
      throw new ForbiddenException(
        `${username} is not the owener of chatSession ${uuid}`,
      );
    }

    return foundSession;
  }

  getChatSessionsList(
    userId: string,
  ): { uuid: string; sessionName: string; historyLength: number }[] {
    return this.chatSessions
      .filter((session) => session.userName === userId)
      .map((session) => ({
        uuid: session.uuid,
        sessionName: session.sessionName,
        userName: session.userName,
        historyLength: session.chatHistory.length,
      }));
  }
}
