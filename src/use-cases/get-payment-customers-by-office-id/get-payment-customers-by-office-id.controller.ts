import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Post,
} from '@nestjs/common';

import { GetPaymentCustomersByOfficeIdDtoIn } from './dtos/get-payment-customers-by-office-id.dto-in';
import { GetPaymentCustomersByOfficeIdRequest } from './http/get-payment-customers-by-office-id.request';
import { GetPaymentCustomersByOfficeIdUseCase } from './get-payment-customers-by-office-id.use-case';

@Controller('payment-customers')
export class GetPaymentCustomersByOfficeIdController {
  constructor(
    private readonly getPaymentCustomersByOfficeIdUseCase: GetPaymentCustomersByOfficeIdUseCase,
  ) {}

  @Post('get-by-office-id')
  async handle(
    @Body() body: GetPaymentCustomersByOfficeIdRequest,
    @Headers('authorization') authorization?: string,
  ) {
    try {
      const token =
        body.token ??
        authorization?.replace(/^Bearer\s+/i, '').trim() ??
        '';

      const dtoOut = await this.getPaymentCustomersByOfficeIdUseCase.exec(
        new GetPaymentCustomersByOfficeIdDtoIn({
          token,
          officeId: body.officeId,
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
          : 'error on get payment customers by office id controller';

      throw new BadRequestException({
        status: 'error',
        message,
      });
    }
  }
}
