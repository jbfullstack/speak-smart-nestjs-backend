import { Test, TestingModule } from '@nestjs/testing';
import { ChatOpenaiConnectorService } from './chat-openai-connector.service';

describe('ChatOpenaiConnectorService', () => {
  let service: ChatOpenaiConnectorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatOpenaiConnectorService],
    }).compile();

    service = module.get<ChatOpenaiConnectorService>(ChatOpenaiConnectorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
