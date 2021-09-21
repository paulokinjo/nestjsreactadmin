import { User } from '../models/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserStub } from './user.stub';

const mockRepository = {
  find: jest.fn().mockReturnValue(UserStub()),
  save: jest.fn(),
  findOne: jest.fn(),
};

describe('UserService', () => {
  let service: UserService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    const user = { email: 'testuser@mail.com' };

    beforeAll(() => {
      service.findOne(user.email);
    });

    it('should call findOne method once', () => {
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should call findOne method once with email parameter', () => {
      expect(mockRepository.findOne).toHaveBeenCalledWith(user.email);
    });
  });

  let users: User[];
  describe('find', () => {
    beforeAll(async () => {
      users = await service.find();
    });

    it('should call find method once', () => {
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should return all data in the database', () => {
      expect(users).toHaveLength(2);
    });
  });

  describe('save', () => {
    it('should call save method once', () => {
      service.save(users[0]);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });
  });
});
