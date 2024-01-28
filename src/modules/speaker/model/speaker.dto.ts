import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSpeakerSessionInputDTO {
  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsString()
  @IsNotEmpty()
  sessionName: string;

  @IsString()
  @IsNotEmpty()
  speakerCharacter: string;
}

export class TextChatWithSpeakerInputDTO {
  @IsString()
  @IsNotEmpty()
  message: string;
}

export class VerbalChatWithSpeakerInputDTO {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  voice: string;
}
