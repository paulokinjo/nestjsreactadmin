import { AuthGuard } from './auth.guard';
import { UserService } from './../user/user.service';
import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Post,
  Get,
  Req,
  Res,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/user/models/user.entity';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './models/register.dto';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('user')
  async user(@Req() request: Request) {
    const cookie = request.cookies['jwt'];
    if (!cookie) {
      throw new BadRequestException('Invalid JWT Token');
    }

    const { id } = await this.jwtService.verifyAsync(cookie);

    return this.userService.findOne({ id });
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    if (!email || !password) {
      throw new BadRequestException(
        'Argument invalid. Email and Password must be informed',
      );
    }
    const user = await this.userService.findOne({ email });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Invalid credentials');
    }

    const jwt = await this.jwtService.signAsync({ id: user.id });

    response.cookie('jwt', jwt, { httpOnly: true });

    return user;
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');

    return {
      message: 'User has logout',
    };
  }

  @Post('register')
  async register(@Body() body: RegisterDto): Promise<User> {
    const { password, passwordConfirm } = body;

    if (password !== passwordConfirm) {
      throw new BadRequestException('Passwords do not match!');
    }

    const hashed = await bcrypt.hash(
      password,
      this.configService.get<number>('database.password.saltOrRounds'),
    );

    const { firstName, lastName, email } = body;

    try {
      return await this.userService.save({
        firstName,
        lastName,
        email,
        password: hashed,
      });
    } catch (error) {
      if (error.message.includes(body.email)) {
        throw new BadRequestException(
          '(Duplicated Entry): Email is already in use',
        );
      }

      throw new Error(error);
    }
  }
}
