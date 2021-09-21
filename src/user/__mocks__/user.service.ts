import { UserStub } from '../test/user.stub';

export const UserService = jest.fn().mockReturnValue({
  find: jest.fn().mockResolvedValue(UserStub()),
  save: jest.fn(),
  findOne: jest.fn().mockReturnValue(UserStub()[0]),
});
