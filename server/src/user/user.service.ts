import { UserCreateDto } from './models/user-create.dto';
import { User } from './models/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  find = (): Promise<User[]> => this.userRepository.find();

  findOne = (condition): Promise<User> =>
    this.userRepository.findOne(condition);

  save = (data: User): Promise<User> => this.userRepository.save(data);

  update = (id: number, data): Promise<any> => {
    return this.userRepository.update(id, data);
  };
}
