import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Post,
} from '@nestjs/common';
import { GetPaymentCustomerByUniqueIdDtoIn } from './dtos/get-payment-customer-by-unique-id.dto-in';
import { GetPaymentCustomerByUniqueIdRequest } from './http/get-payment-customer-by-unique-id.request';
import { GetPaymentCustomerByUniqueIdUseCase } from './get-payment-customer-by-unique-id.use-case';

@Controller('payment-customers')
export class GetPaymentCustomerByUniqueIdController {
  constructor(
    private readonly getPaymentCustomerByUniqueIdUseCase: GetPaymentCustomerByUniqueIdUseCase,
  ) {}

  @Post('get-by-unique-id')
  async handle(
    @Body() body: GetPaymentCustomerByUniqueIdRequest,
    @Headers('authorization') authorization?: string,
  ) {
    try {
      const token =
        body.token ??
        authorization?.replace(/^Bearer\s+/i, '').trim() ??
        '';

      const dtoOut = await this.getPaymentCustomerByUniqueIdUseCase.exec(
        new GetPaymentCustomerByUniqueIdDtoIn({
          token,
          paymentCustomerId: body.paymentCustomerId,
        }),
      );

      return {
        status: 'success',
        message: 'payment customer found successfully',
        data: dtoOut,
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on get payment customer by unique id controller';

      throw new BadRequestException({
        status: 'error',
        message,
      });
    }
  }
}