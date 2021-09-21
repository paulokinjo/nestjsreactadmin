import { UserService } from '../user.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';

jest.mock('../user.service');

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('find', () => {
    it('should call find once', () => {
      controller.find();
      expect(service.find).toHaveBeenCalledTimes(1);
    });
  });
});
