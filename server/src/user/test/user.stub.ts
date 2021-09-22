import { User } from '../models/user.entity';

export const UserStub = () =>
  [
    {
      id: 1,
      email: 'user1@mail.com',
      firstName: 'User1',
      lastName: 'LastName User1',
      password: 'P@ssword',
    },
    {
      id: 2,
      email: 'user2@mail.com',
      firstName: 'User2',
      lastName: 'LastName User2',
      password: 'P@ssword',
    },
  ] as User[];
