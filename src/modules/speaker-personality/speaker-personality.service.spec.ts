import { Test, TestingModule } from '@nestjs/testing';
import { SpeakerPersonalityService } from './speaker-personality.service';

describe('SpeakerPersonalityService', () => {
  let service: SpeakerPersonalityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpeakerPersonalityService],
    }).compile();

    service = module.get<SpeakerPersonalityService>(SpeakerPersonalityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
