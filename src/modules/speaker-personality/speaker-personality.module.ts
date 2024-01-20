import { Module } from '@nestjs/common';
import { SpeakerPersonalityService } from './speaker-personality.service';
import { SpeakerPersonalityController } from './speaker-personality.controller';

@Module({
  providers: [SpeakerPersonalityService],
  controllers: [SpeakerPersonalityController]
})
export class SpeakerPersonalityModule {}
