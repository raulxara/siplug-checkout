import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';

import { ListCheckoutSessionsByOfficeIdDtoIn } from './dtos/list-checkout-sessions-by-office-id.dto-in';
import { ListCheckoutSessionsByOfficeIdRequest } from './http/list-checkout-sessions-by-office-id.request';
import { ListCheckoutSessionsByOfficeIdUseCase } from './list-checkout-sessions-by-office-id.use-case';

@Controller('checkout-sessions')
export class ListCheckoutSessionsByOfficeIdController {
  constructor(
    private readonly listCheckoutSessionsByOfficeIdUseCase: ListCheckoutSessionsByOfficeIdUseCase,
  ) {}

  @Post('list-by-office-id')
  @HttpCode(HttpStatus.OK)
  async handle(
    @Body() body: ListCheckoutSessionsByOfficeIdRequest,
    @Headers('authorization') authorization?: string,
  ) {
    try {
      const token =
        body.token ?? authorization?.replace(/^Bearer\s+/i, '').trim() ?? '';

      const dtoOut = await this.listCheckoutSessionsByOfficeIdUseCase.exec(
        new ListCheckoutSessionsByOfficeIdDtoIn({
          token,
          officeId: body.officeId,
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
          : 'error on list checkout sessions by office id controller';

      throw new BadRequestException({
        status: 'error',
        message,
      });
    }
  }
}
