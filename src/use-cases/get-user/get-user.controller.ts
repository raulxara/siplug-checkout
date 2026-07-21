import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Post,
} from '@nestjs/common';
import { GetUserDtoIn } from './dtos/get-user.dto-in';
import { GetUserRequest } from './http/get-user.request';
import { GetUserUseCase } from './get-user.use-case';

@Controller('users')
export class GetUserController {
  constructor(private readonly getUserUseCase: GetUserUseCase) {}

  @Post('get')
  async handle(
    @Body() body: GetUserRequest,
    @Headers('authorization') authorization?: string,
  ) {
    try {
      const token =
        body.token ??
        authorization?.replace(/^Bearer\s+/i, '').trim() ??
        '';

      const dtoOut = await this.getUserUseCase.exec(
        new GetUserDtoIn({
          token,
          userCustomerId: body.userCustomerId,
        }),
      );

      return {
        status: 'success',
        message: 'user found successfully',
        data: dtoOut,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'error on get user controller';

      throw new BadRequestException({
        status: 'error',
        message,
      });
    }
  }
}