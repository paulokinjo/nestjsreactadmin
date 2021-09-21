import { RegisterDto } from './../models/register.dto';

export const RegisterDtoStub = () =>
  [
    {
      email: 'user1@mail.com',
      firstName: 'User1',
      lastName: 'LastName User1',
      password: 'P@ssword',
      passwordConfirm: 'P@ssword',
    },
    {
      email: 'user2@mail.com',
      firstName: 'User2',
      lastName: 'LastName User2',
      password: 'P@ssword',
      passwordConfirm: 'P@ssword',
    },
  ] as RegisterDto[];
