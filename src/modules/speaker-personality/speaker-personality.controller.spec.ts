import { Test, TestingModule } from '@nestjs/testing';
import { SpeakerPersonalityController } from './speaker-personality.controller';

describe('SpeakerPersonalityController', () => {
  let controller: SpeakerPersonalityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpeakerPersonalityController],
    }).compile();

    controller = module.get<SpeakerPersonalityController>(SpeakerPersonalityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
