import { Test, TestingModule } from '@nestjs/testing';
import { ChatPersonalityService } from './chat-personality.service';

describe('ChatPersonalityService', () => {
  let service: ChatPersonalityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatPersonalityService],
    }).compile();

    service = module.get<ChatPersonalityService>(ChatPersonalityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
