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
  ) {}

  @HttpCode(201)
  @Post('/start-session')
  createNewSession(
    @Body(new ValidationPipe({ transform: true }))
    data: CreateSpeakerSessionInputDTO,
  ) {
    const sessionData = this.speakerService.buildSessionData(data);
    return this.gptService.startNewSession(sessionData);
  }

  @HttpCode(200)
  @Get('/user/:userId/sessions')
  getSessionsList(@Param('userId') userId) {
    const sessionIds = this.gptService.getSessionsList(userId);
    return sessionIds;
  }

  @HttpCode(201)
  @Post('/user/:user/verbal-chatting/:chatSessionId')
  async verbalChatting(
    @Param('user') userName,
    @Param('chatSessionId') uuid,
    @Body(new ValidationPipe({ transform: true }))
    data: ChatWithSpeakerInputDTO,
    @Res() res: Response,
  ) {
    const audioStream = await this.speakerService.getSpokenpeakerResponse(
      uuid,
      userName,
      data,
    );

    res.setHeader('Content-Type', 'audio/mpeg; charset=binary');
    res.charset = 'binary';
    res.status(HttpStatus.OK);

    audioStream.pipe(res);
  }

  @HttpCode(201)
  @Post('/user/:user/text-chatting/:chatSessionId')
  async textChatting(
    @Param('user') userName,
    @Param('chatSessionId') uuid,
    @Body(new ValidationPipe({ transform: true }))
    data: ChatWithSpeakerInputDTO,
  ) {
    const speakerAnswer = await this.speakerService.getWrittenSpeakerResponse(
      uuid,
      userName,
      data,
    );

    return {
      message: speakerAnswer,
    };
  }
}
