import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ListCheckoutSessionsDtoIn } from './dtos/list-checkout-sessions.dto-in';
import { ListCheckoutSessionsRequest } from './http/list-checkout-sessions.request';
import { ListCheckoutSessionsUseCase } from './list-checkout-sessions.use-case';

@Controller('checkout-sessions')
export class ListCheckoutSessionsController {
  constructor(
    private readonly listCheckoutSessionsUseCase: ListCheckoutSessionsUseCase,
  ) {}

  @Post('list')
  @HttpCode(HttpStatus.OK)
  async handle(
    @Body() body: ListCheckoutSessionsRequest,
    @Headers('authorization') authorization?: string,
  ) {
    try {
      const token =
        body.token ?? authorization?.replace(/^Bearer\s+/i, '').trim() ?? '';

      const dtoOut = await this.listCheckoutSessionsUseCase.exec(
        new ListCheckoutSessionsDtoIn({
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
        message: 'checkout sessions listed successfully',
        data: dtoOut,
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on list checkout sessions controller';

      throw new BadRequestException({
        status: 'error',
        message,
      });
    }
  }
}
