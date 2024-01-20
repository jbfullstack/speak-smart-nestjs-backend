import { Test, TestingModule } from '@nestjs/testing';
import { ChatPersonalityController } from './chat-personality.controller';

describe('ChatPersonalityController', () => {
  let controller: ChatPersonalityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatPersonalityController],
    }).compile();

    controller = module.get<ChatPersonalityController>(ChatPersonalityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
