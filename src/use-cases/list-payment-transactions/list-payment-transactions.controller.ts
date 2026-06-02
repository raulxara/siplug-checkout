import {
  BadRequestException,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ListPaymentTransactionsDtoIn } from './dtos/list-payment-transactions.dto-in';
import { ListPaymentTransactionsUseCase } from './list-payment-transactions.use-case';

@Controller('payment-transactions')
export class ListPaymentTransactionsController {
  constructor(
    private readonly listPaymentTransactionsUseCase: ListPaymentTransactionsUseCase,
  ) {}

  @Post('list')
  @HttpCode(HttpStatus.OK)
  async handle(
    @Headers('authorization') authorization: string | undefined,
  ): Promise<Record<string, unknown>> {
    try {
      const dtoOut = await this.listPaymentTransactionsUseCase.exec(
        new ListPaymentTransactionsDtoIn({
          token: this.extractBearerToken(authorization),
        }),
      );

      return {
        status: 'success',
        message: 'payment transactions listed successfully',
        data: {
          paymentTransactions: dtoOut.paymentTransactions,
        },
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on list payment transactions';

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
