import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserCreateDto {
  @IsNotEmpty()
  firstName: string;

  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
