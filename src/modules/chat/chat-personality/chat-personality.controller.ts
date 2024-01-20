import {
  Body,
  Controller,
  HttpCode,
  Logger,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { ChatPersonalityService } from './chat-personality.service';
import { PersonalityInputDto } from './model/personality.dto';
import { ChatPersonality } from './model/chat-personality';

@Controller('chat-personality')
export class ChatPersonalityController {
  private readonly logger: Logger = new Logger(ChatPersonalityController.name);
  constructor(private readonly service: ChatPersonalityService) {
    this.service.initChatWithPersonality(ChatPersonality.Friendly);
  }

  @HttpCode(201)
  @Post('/add-personality')
  addPersonaity(
    @Body(new ValidationPipe({ transform: true }))
    data: PersonalityInputDto,
  ) {
    this.logger.log(`controlMessage: ${data.message}`);
    return this.service.rewriteWithPersonality(data.message);
  }
}
