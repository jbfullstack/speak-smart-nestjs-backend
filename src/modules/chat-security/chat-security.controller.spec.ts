import { Test, TestingModule } from '@nestjs/testing';
import { ChatSecurityController } from './chat-security.controller';

describe('ChatSecurityController', () => {
  let controller: ChatSecurityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatSecurityController],
    }).compile();

    controller = module.get<ChatSecurityController>(ChatSecurityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
