import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Put,
} from '@nestjs/common';
import { UpdateUserDtoIn } from './dtos/update-user.dto-in';
import { UpdateUserRequest } from './http/update-user.request';
import { UpdateUserUseCase } from './update-user.use-case';

@Controller('users')
export class UpdateUserController {
  constructor(private readonly updateUserUseCase: UpdateUserUseCase) {}

  @Put('update')
  async handle(
    @Body() body: UpdateUserRequest,
    @Headers('authorization') authorization?: string,
  ) {
    try {
      const token =
        body.token ??
        authorization?.replace(/^Bearer\s+/i, '').trim() ??
        '';

      const dtoOut = await this.updateUserUseCase.exec(
        new UpdateUserDtoIn({
          token,
          userCustomerId: body.userCustomerId,

          officeId: body.officeId ?? null,
          positionSlug: body.positionSlug ?? null,

          firstName: body.firstName ?? null,
          lastName: body.lastName ?? null,
          email: body.email ?? null,
          phone: body.phone ?? null,

          documentType: body.documentType ?? null,
          documentValue: body.documentValue ?? null,

          username: body.username ?? null,
          password: body.password ?? null,
          userType: body.userType ?? null,

          twoFaRequired: body.twoFaRequired ?? null,
          twoFaActive: body.twoFaActive ?? null,

          profileConfig: body.profileConfig ?? null,
          clientConfig: body.clientConfig ?? null,
          userCustomerConfig: body.userCustomerConfig ?? null,

          status: body.status ?? null,
          source: body.source ?? 'UpdateUserController',
        }),
      );

      return {
        status: 'success',
        message: 'user updated successfully',
        data: dtoOut,
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on update user controller';

      throw new BadRequestException({
        status: 'error',
        message,
      });
    }
  }
}