import { Body, Controller, Headers, Post } from '@nestjs/common';

import { ListPaymentSplitsByPaymentTransactionIdDtoIn } from './dtos/list-payment-splits-by-payment-transaction-id.dto-in';
import { ListPaymentSplitsByPaymentTransactionIdRequest } from './http/list-payment-splits-by-payment-transaction-id.request';
import { ListPaymentSplitsByPaymentTransactionIdUseCase } from './list-payment-splits-by-payment-transaction-id.use-case';

@Controller('payment-splits')
export class ListPaymentSplitsByPaymentTransactionIdController {
  constructor(
    private readonly listPaymentSplitsByPaymentTransactionIdUseCase: ListPaymentSplitsByPaymentTransactionIdUseCase,
  ) {}

  @Post('list-by-payment-transaction-id')
  async handle(
    @Body() request: ListPaymentSplitsByPaymentTransactionIdRequest,
    @Headers('authorization') authorization?: string,
  ) {
    const dtoOut =
      await this.listPaymentSplitsByPaymentTransactionIdUseCase.exec(
        new ListPaymentSplitsByPaymentTransactionIdDtoIn({
          token: this.resolveToken(authorization, request.token),
          paymentTransactionId: request.paymentTransactionId,
        }),
      );

    return {
      status: 'success',
      message: 'payment splits listed by payment transaction successfully',
      data: {
        paymentSplits: dtoOut.paymentSplits,
      },
    };
  }

  private resolveToken(
    authorization: string | undefined,
    fallbackToken: string | undefined,
  ): string {
    if (authorization && authorization.startsWith('Bearer ')) {
      return authorization.replace('Bearer ', '').trim();
    }

    return String(fallbackToken ?? '').trim();
  }
}
