import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { SpeakerService } from './speaker.service';

import { Response } from 'express';
import { AudioGateway } from './audio-gateway-websocket';
import {
  ChatWithSpeakerInputDTO,
  CreateSpeakerSessionInputDTO,
} from './model/speaker.dto';
import { ChatGptApiService } from '../openai/chat-gpt-api/chat-gpt-api.service';

//! TODO : Secure endpoints
@Controller('ai-speaker')
export class SpeakerController {
  constructor(
    private readonly speakerService: SpeakerService,
    private readonly gptService: ChatGptApiService,
    private readonly audioGateway: AudioGateway,
  ) {}

  @HttpCode(201)
  @Post('/start-session')
  createNewSession(
    @Body(new ValidationPipe({ transform: true }))
    data: CreateSpeakerSessionInputDTO,
  ) {
    const sessionData = {
      ...data,
      systemMessage: this.getSystemMessageFromCharacter(
        data.userName,
        data.speakerCharacter,
      ),
    };
    return this.gptService.startNewSession(sessionData);
  }
  // TODO: Use mapper
  getSystemMessageFromCharacter(userName: string, speakerCharacter: string) {
    return `Be short and clear. You must always start answering by 'Hello dear ${userName}'`;
  }

  @HttpCode(200)
  @Get('/user/:userId/sessions')
  getSessionsList(@Param('userId') userId) {
    const sessionIds = this.gptService.getSessionsList(userId);
    return sessionIds;
  }

  // @HttpCode(201)
  // @Post('/user/:user/chat-session/:chatSessionId')
  // async chatWithSpeaker(
  //   @Param('user') userName,
  //   @Param('chatSessionId') uuid,
  //   @Body(new ValidationPipe({ transform: true }))
  //   data: ChatWithSpeakerInputDTO,
  //   @Res() res: Response,
  // ) {
  //   const audioStream = await this.speakerService.getSpeakerResponse(
  //     uuid,
  //     userName,
  //     data,
  //   );

  //   // TODO: temp
  //   res.status(HttpStatus.OK);
  //   res.append(audioStream);

  //   // res.setHeader('Content-Type', 'audio/mpeg; charset=binary');
  //   // res.charset = 'binary';
  //   // res.status(HttpStatus.OK);

  //   // // Pipe the audio stream directly to the response
  //   // audioStream.pipe(res);
  // }

  @HttpCode(201)
  @Post('/user/:user/chat-session/:chatSessionId')
  async chatWithSpeaker(
    @Param('user') userName,
    @Param('chatSessionId') uuid,
    @Body(new ValidationPipe({ transform: true }))
    data: ChatWithSpeakerInputDTO,
  ) {
    const audioStream = await this.speakerService.getSpeakerResponse(
      uuid,
      userName,
      data,
    );

    // TODO: temp
    return {
      message: audioStream,
    };

    // res.setHeader('Content-Type', 'audio/mpeg; charset=binary');
    // res.charset = 'binary';
    // res.status(HttpStatus.OK);

    // // Pipe the audio stream directly to the response
    // audioStream.pipe(res);
  }
}
