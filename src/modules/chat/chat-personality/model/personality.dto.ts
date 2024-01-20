import { IsNotEmpty, IsString } from 'class-validator';

export class PersonalityInputDto {
  @IsString()
  @IsNotEmpty()
  message: string;
}
