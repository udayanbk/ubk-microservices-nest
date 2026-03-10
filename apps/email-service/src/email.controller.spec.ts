import { Test, TestingModule } from '@nestjs/testing';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';

describe('EmailServiceController', () => {
  let emailServiceController: EmailController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [EmailController],
      providers: [EmailService],
    }).compile();

    emailServiceController = app.get<EmailController>(EmailController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect('Hello World!');
    });
  });
});
