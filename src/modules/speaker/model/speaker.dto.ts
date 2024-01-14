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

export class ChatWithSpeakerInputDTO {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  voice: string;
}
