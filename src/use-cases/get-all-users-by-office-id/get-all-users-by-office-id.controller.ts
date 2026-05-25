import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Post,
} from '@nestjs/common';
import { GetAllUsersByOfficeIdDtoIn } from './dtos/get-all-users-by-office-id.dto-in';
import { GetAllUsersByOfficeIdRequest } from './http/get-all-users-by-office-id.request';
import { GetAllUsersByOfficeIdUseCase } from './get-all-users-by-office-id.use-case';

@Controller('users')
export class GetAllUsersByOfficeIdController {
  constructor(
    private readonly getAllUsersByOfficeIdUseCase: GetAllUsersByOfficeIdUseCase,
  ) {}

  @Post('get-all-by-office-id')
  async handle(
    @Body() body: GetAllUsersByOfficeIdRequest,
    @Headers('authorization') authorization?: string,
  ) {
    try {
      const token =
        body.token ??
        authorization?.replace(/^Bearer\s+/i, '').trim() ??
        '';

      const dtoOut = await this.getAllUsersByOfficeIdUseCase.exec(
        new GetAllUsersByOfficeIdDtoIn({
          token,
          officeId: body.officeId,
          status: body.status ?? null,
          search: body.search ?? null,
          page: body.page ?? 1,
          perPage: body.perPage ?? 20,
        }),
      );

      return {
        status: 'success',
        message: 'office users listed successfully',
        data: dtoOut,
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on get all users by office id controller';

      throw new BadRequestException({
        status: 'error',
        message,
      });
    }
  }
}