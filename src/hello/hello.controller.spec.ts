import { Test, TestingModule } from '@nestjs/testing';
import { HelloController } from './hello.controller';

describe('HelloController', () => {
  let controller: HelloController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HelloController],
    }).compile();

    controller = module.get<HelloController>(HelloController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getHello', () => {
    it('should return hello message with user data', () => {
      const mockRequest = {
        user: {
          id: 1,
          email: 'test@example.com',
          name: 'Test User',
        },
      };

      const result = controller.getHello(mockRequest);

      expect(result).toEqual({
        message: 'Hello World!',
        user: mockRequest.user,
      });
    });
  });
});
