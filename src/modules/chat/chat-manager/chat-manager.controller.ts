import {
  Body,
  Controller,
  HttpCode,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { CreateSpeakerSessionInputDTO } from '../../speaker/model/speaker.dto';

@Controller('chat-manager')
export class ChatManagerController {
  @HttpCode(201)
  @Post('/start-session')
  createNewSession(
    @Body(new ValidationPipe({ transform: true }))
    data: CreateSpeakerSessionInputDTO,
  ) {
    //   const sessionData = {
    //     ...data,
    //     systemMessage: this.getSystemMessageFromCharacter(
    //       data.userName,
    //       data.speakerCharacter,
    //     ),
    //   };
    //   return this.gptService.startNewSession(sessionData);
  }
}
