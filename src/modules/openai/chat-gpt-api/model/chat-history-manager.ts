import { SessionType } from './chat-session-response.interface';
import { ChatSession } from './chat-session';
import { Logger, UnauthorizedException } from '@nestjs/common';

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

  getChatSession(uuid: string): ChatSession | undefined {
    return this.chatSessions.find((session) => session.uuid === uuid);
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
