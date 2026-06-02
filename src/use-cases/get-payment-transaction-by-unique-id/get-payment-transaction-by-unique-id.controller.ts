import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { GetPaymentTransactionByUniqueIdDtoIn } from './dtos/get-payment-transaction-by-unique-id.dto-in';
import { GetPaymentTransactionByUniqueIdRequest } from './http/get-payment-transaction-by-unique-id.request';
import { GetPaymentTransactionByUniqueIdUseCase } from './get-payment-transaction-by-unique-id.use-case';

@Controller('payment-transactions')
export class GetPaymentTransactionByUniqueIdController {
  constructor(
    private readonly getPaymentTransactionByUniqueIdUseCase: GetPaymentTransactionByUniqueIdUseCase,
  ) {}

  @Post('get-by-unique-id')
  @HttpCode(HttpStatus.OK)
  async handle(
    @Headers('authorization') authorization: string | undefined,
    @Body() body: GetPaymentTransactionByUniqueIdRequest,
  ): Promise<Record<string, unknown>> {
    try {
      const dtoOut = await this.getPaymentTransactionByUniqueIdUseCase.exec(
        new GetPaymentTransactionByUniqueIdDtoIn({
          token: this.extractBearerToken(authorization),
          paymentTransactionId: body.paymentTransactionId,
        }),
      );

      return {
        status: 'success',
        message: 'payment transaction found successfully',
        data: {
          paymentTransaction: dtoOut.paymentTransaction,
        },
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on get payment transaction by unique id';

      throw new BadRequestException({
        status: 'error',
        message,
      });
    }
  }

  private extractBearerToken(authorization: string | undefined): string {
    if (!authorization || authorization.trim() === '') {
      throw new Error('authorization header is required');
    }

    return authorization.replace(/^Bearer\s+/i, '').trim();
  }
}
