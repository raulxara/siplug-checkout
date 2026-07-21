import { Body, Controller, Headers, Post } from '@nestjs/common';

import { GetPaymentSplitByUniqueIdDtoIn } from './dtos/get-payment-split-by-unique-id.dto-in';
import { GetPaymentSplitByUniqueIdRequest } from './http/get-payment-split-by-unique-id.request';
import { GetPaymentSplitByUniqueIdUseCase } from './get-payment-split-by-unique-id.use-case';

@Controller('payment-splits')
export class GetPaymentSplitByUniqueIdController {
  constructor(
    private readonly getPaymentSplitByUniqueIdUseCase: GetPaymentSplitByUniqueIdUseCase,
  ) {}

  @Post('get-by-unique-id')
  async handle(
    @Body() request: GetPaymentSplitByUniqueIdRequest,
    @Headers('authorization') authorization?: string,
  ) {
    const dtoOut = await this.getPaymentSplitByUniqueIdUseCase.exec(
      new GetPaymentSplitByUniqueIdDtoIn({
        token: this.resolveToken(authorization, request.token),
        paymentSplitId: request.paymentSplitId ?? request._id,
      }),
    );

    return {
      status: 'success',
      message: 'payment split found successfully',
      data: {
        paymentSplit: dtoOut.paymentSplit,
        paymentSplitRecipients: dtoOut.paymentSplitRecipients,
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
