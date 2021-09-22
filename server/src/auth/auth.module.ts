import { CommonModule } from './../common/common.module';
import { UserModule } from './../user/user.module';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  imports: [UserModule, CommonModule],
})
export class AuthModule {}
