import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Post,
} from '@nestjs/common';
import { RegisterUserDtoIn } from './dtos/register-user.dto-in';
import { RegisterUserRequest } from './http/register-user.request';
import { RegisterUserUseCase } from './register-user.use-case';

@Controller('users')
export class RegisterUserController {
  constructor(private readonly registerUserUseCase: RegisterUserUseCase) {}

  @Post('register')
  async handle(
    @Body() body: RegisterUserRequest,
    @Headers('authorization') authorization?: string,
  ) {
    try {
      const token =
        body.token ??
        authorization?.replace(/^Bearer\s+/i, '').trim() ??
        '';

      const dtoOut = await this.registerUserUseCase.exec(
        new RegisterUserDtoIn({
          token,
          officeId: body.officeId,
          positionSlug: body.positionSlug ?? 'customer',
          firstName: body.firstName,
          lastName: body.lastName,
          email: body.email,
          phone: body.phone ?? null,
          documentType: body.documentType ?? null,
          documentValue: body.documentValue ?? null,
          username: body.username,
          password: body.password,
          userType: body.userType ?? 'customer',
          twoFaRequired: body.twoFaRequired ?? false,
          twoFaChannels: body.twoFaChannels ?? [],
          profileConfig: body.profileConfig ?? null,
          clientConfig: body.clientConfig ?? null,
          userCustomerConfig: body.userCustomerConfig ?? null,
          status: body.status ?? 'active',
        }),
      );

      return {
        status: 'success',
        message: 'user registered successfully',
        data: dtoOut,
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on register user controller';

      throw new BadRequestException({
        status: 'error',
        message,
      });
    }
  }
}