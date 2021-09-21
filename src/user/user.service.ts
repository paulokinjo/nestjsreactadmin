import { User } from './models/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  find = async (): Promise<User[]> => await this.userRepository.find();

  findOne = async (condition): Promise<User> =>
    await this.userRepository.findOne(condition);

  save = async (data: User): Promise<User> =>
    await this.userRepository.save(data);
}
