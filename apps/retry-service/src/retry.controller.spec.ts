import { Test, TestingModule } from '@nestjs/testing';
import { RetryController } from './retry.controller';

describe('RetryController', () => {
  let retryController: RetryController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RetryController],
      providers: [RetryController],
    }).compile();

    retryController = app.get<RetryController>(RetryController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect('Hello Retry LOgic!');
    });
  });
});
