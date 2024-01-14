import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSessionInputDto {
  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsString()
  @IsNotEmpty()
  sessionName: string;

  @IsString()
  systemMessage: string;
}

export class GetChatGptInputDTO {
  @IsString()
  @IsNotEmpty()
  message: string;
}

export class GetChatGptOutputDTO {
  @IsString()
  @IsNotEmpty()
  aiMessage: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  sessionId: string;

  static getInstance(aiMessage: string) {
    const result = new GetChatGptOutputDTO();
    result.aiMessage = aiMessage;
    return result;
  }
}
