import { Body, Controller, Headers, Post } from '@nestjs/common';

import { CalculatePaymentSplitDtoIn } from './dtos/calculate-payment-split.dto-in';
import { CalculatePaymentSplitRequest } from './http/calculate-payment-split.request';
import { CalculatePaymentSplitUseCase } from './calculate-payment-split.use-case';

@Controller('payment-splits')
export class CalculatePaymentSplitController {
  constructor(
    private readonly calculatePaymentSplitUseCase: CalculatePaymentSplitUseCase,
  ) {}

  @Post('calculate')
  async handle(
    @Body() request: CalculatePaymentSplitRequest,
    @Headers('authorization') authorization?: string,
  ) {
    const dtoOut = await this.calculatePaymentSplitUseCase.exec(
      new CalculatePaymentSplitDtoIn({
        token: this.resolveToken(authorization, request.token),
        splitRuleId: request.splitRuleId,
        grossAmount: request.grossAmount,
        gatewayFeeAmount: request.gatewayFeeAmount,
        netAmount: request.netAmount,
        currency: request.currency,
        metadata: request.metadata,
      }),
    );

    return {
      status: 'success',
      message: 'payment split calculated successfully',
      data: {
        paymentSplitCalculation: dtoOut.paymentSplitCalculation,
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
