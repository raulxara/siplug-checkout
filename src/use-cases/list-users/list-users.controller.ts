import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Post,
} from '@nestjs/common';
import { ListUsersDtoIn } from './dtos/list-users.dto-in';
import { ListUsersRequest } from './http/list-users.request';
import { ListUsersUseCase } from './list-users.use-case';

@Controller('users')
export class ListUsersController {
  constructor(private readonly listUsersUseCase: ListUsersUseCase) {}

  @Post('list')
  async handle(
    @Body() body: ListUsersRequest,
    @Headers('authorization') authorization?: string,
  ) {
    try {
      const token =
        body.token ??
        authorization?.replace(/^Bearer\s+/i, '').trim() ??
        '';

      const dtoOut = await this.listUsersUseCase.exec(
        new ListUsersDtoIn({
          token,
          officeId: body.officeId ?? null,
          status: body.status ?? null,
          search: body.search ?? null,
          page: body.page ?? 1,
          perPage: body.perPage ?? 20,
        }),
      );

      return {
        status: 'success',
        message: 'users listed successfully',
        data: dtoOut,
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on list users controller';

      throw new BadRequestException({
        status: 'error',
        message,
      });
    }
  }
}