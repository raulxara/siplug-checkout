import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Post,
} from '@nestjs/common';
import { ListPaymentCustomersDtoIn } from './dtos/list-payment-customers.dto-in';
import { ListPaymentCustomersRequest } from './http/list-payment-customers.request';
import { ListPaymentCustomersUseCase } from './list-payment-customers.use-case';

@Controller('payment-customers')
export class ListPaymentCustomersController {
  constructor(
    private readonly listPaymentCustomersUseCase: ListPaymentCustomersUseCase,
  ) {}

  @Post('list')
  async handle(
    @Body() body: ListPaymentCustomersRequest,
    @Headers('authorization') authorization?: string,
  ) {
    try {
      const token =
        body.token ??
        authorization?.replace(/^Bearer\s+/i, '').trim() ??
        '';

      const dtoOut = await this.listPaymentCustomersUseCase.exec(
        new ListPaymentCustomersDtoIn({
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
        message: 'payment customers listed successfully',
        data: dtoOut,
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on list payment customers controller';

      throw new BadRequestException({
        status: 'error',
        message,
      });
    }
  }
}