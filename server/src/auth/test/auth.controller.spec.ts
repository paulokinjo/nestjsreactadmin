import { HttpStatus } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import * as bcrypt from 'bcryptjs';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../config/configuration';
import { RegisterDto } from '../models/register.dto';
import { RegisterDtoStub } from './auth.stub';
import { UserStub } from '../../user/test/user.stub';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';

jest.mock('../../user/user.service');

const users: RegisterDto[] = RegisterDtoStub();

const mockJwtService = {
  signAsync: jest.fn().mockReturnValue('sometoken'),
  verifyAsync: jest.fn().mockReturnValue(UserStub()[0]),
};

const mockResponse: any = {
  cookie: jest.fn(),
};

describe('AuthController', () => {
  let module: TestingModule;
  let controller: AuthController;
  let service: UserService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        UserService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
        }),
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  function validateResponse<
    T extends { message: string; getStatus: VoidFunction },
  >(error: T, message: string, statusCode: number) {
    expect(error.message).toBe(message);
    expect(error.getStatus()).toBe(statusCode);
  }

  describe('user', () => {
    it('should verify token from cookie', async () => {
      const cookies = { jwt: 'fakejwttoken' };
      await controller.user({ cookies } as Request);

      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(cookies.jwt);
    });

    it('should return a user when the token is valid', async () => {
      const cookies = { jwt: 'fakejwttoken' };
      const response = await controller.user({ cookies } as Request);
      expect(response.email).toBe(UserStub()[0].email);
      expect(response.id).toBe(UserStub()[0].id);
      expect(response.firstName).toBe(UserStub()[0].firstName);
    });

    xit('should return a user without password field when the token is valid', async () => {
      const cookies = { jwt: 'fakejwttoken' };
      const response = await controller.user({ cookies } as Request);
      expect(response.email).toBe(UserStub()[0].email);
      expect(response.id).toBe(UserStub()[0].id);
      expect(response.password).toBeFalsy();
    });
  });

  describe('logout', () => {
    it('should clear the cookie', async () => {
      const clearCookie = jest.fn();
      await controller.logout({ clearCookie } as any);

      expect(clearCookie).toHaveBeenCalledWith('jwt');
    });
  });

  describe('login', () => {
    let user: { email: string; password: string };

    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

    beforeAll(async () => {
      user = {
        email: UserStub()[0].email,
        password: await bcrypt.hash(UserStub()[0].password, 12),
      };

      await controller.login(
        user.email,
        user.password,
        mockResponse as Response,
      );
    });

    it('should call findOne service', () => {
      expect(service.findOne).toHaveBeenCalled();
    });

    it('should call findOne service once with email value', () => {
      expect(service.findOne).toHaveBeenCalledWith({ email: user.email });
    });

    it('should call jwt sign async method once', async () => {
      expect(mockJwtService.signAsync).toHaveBeenCalled();
    });

    it('should call jwt sign async method once with user id', async () => {
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        id: UserStub()[0].id,
      });
    });

    it('should put the jwt token into the response cookie', () => {
      expect(mockResponse.cookie).toHaveBeenCalledWith('jwt', 'sometoken', {
        httpOnly: true,
      });
    });

    it('should throw a bad request exception if the passwords do not match', async () => {
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);
      try {
        const newController = module.get<AuthController>(AuthController);
        await newController.login(
          user.email,
          user.password,
          mockResponse as Response,
        );

        expect(false).toBe(true);
      } catch (error) {
        validateResponse(error, 'Invalid credentials', HttpStatus.BAD_REQUEST);
      }

      jest.clearAllMocks();
    });

    it('should throw a NotFoundException when the user does not exist', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(undefined);
      try {
        const newController = module.get<AuthController>(AuthController);
        await newController.login(
          'nonexistentemail@mail.com',
          'password',
          mockResponse as Response,
        );

        expect(false).toBe(true);
      } catch (error) {
        validateResponse(error, 'User not found', HttpStatus.NOT_FOUND);
      }

      jest.clearAllMocks();
    });
  });

  describe('register', () => {
    const spyBcryptHash = jest
      .spyOn(bcrypt, 'hash')
      .mockResolvedValue('hashedpassword' as never);

    beforeAll(async () => {
      await controller.register(users[0]);
    });

    it('should call save service once', () => {
      expect(service.save).toHaveBeenCalledTimes(1);
    });

    it('should call save service with specified parameters', () => {
      expect(service.save).toHaveBeenCalledWith({
        ...users[0],
        password: 'hashedpassword',
      });
    });

    it('should call hash password with 12 saltOrRounds', () => {
      expect(spyBcryptHash).toHaveBeenCalledWith(users[0].password, 12);

      spyBcryptHash.mockClear();
    });

    it('should throw a bad request when passwords do not match', async () => {
      const newRequestController = module.get<AuthController>(AuthController);

      try {
        await newRequestController.register({
          ...users[0],
          passwordConfirm: 'not matching password',
        });
      } catch (error) {
        validateResponse(
          error,
          'Passwords do not match!',
          HttpStatus.BAD_REQUEST,
        );
      }
    });

    it('should throw a bad request when email already exist', async () => {
      const errorMessage = `(Duplicated Entry): Email ${users[0].email} is already in use`;
      const spy = jest.spyOn(service, 'save').mockImplementationOnce(() => {
        throw new Error(errorMessage);
      });

      try {
        await controller.register({ ...users[0] });
      } catch (error) {
        validateResponse(
          error,
          '(Duplicated Entry): Email is already in use',
          HttpStatus.BAD_REQUEST,
        );
      } finally {
        spy.mockClear();
      }
    });
  });
});
