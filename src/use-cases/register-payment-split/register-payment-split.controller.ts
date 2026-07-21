import { Body, Controller, Headers, Post } from '@nestjs/common';

import { RegisterPaymentSplitDtoIn } from './dtos/register-payment-split.dto-in';
import { RegisterPaymentSplitRequest } from './http/register-payment-split.request';
import { RegisterPaymentSplitUseCase } from './register-payment-split.use-case';

@Controller('payment-splits')
export class RegisterPaymentSplitController {
  constructor(
    private readonly registerPaymentSplitUseCase: RegisterPaymentSplitUseCase,
  ) {}

  @Post('register')
  async handle(
    @Body() request: RegisterPaymentSplitRequest,
    @Headers('authorization') authorization?: string,
  ) {
    const dtoOut = await this.registerPaymentSplitUseCase.exec(
      new RegisterPaymentSplitDtoIn({
        token: this.resolveToken(authorization, request.token),

        splitRuleId: request.splitRuleId,
        checkoutSessionId: request.checkoutSessionId,
        paymentTransactionId: request.paymentTransactionId,
        subscriptionId: request.subscriptionId,
        subscriptionInvoiceId: request.subscriptionInvoiceId,
        gatewayProvider: request.gatewayProvider,

        grossAmount: request.grossAmount,
        gatewayFeeAmount: request.gatewayFeeAmount,
        netAmount: request.netAmount,
        currency: request.currency,

        metadata: request.metadata,
        config: request.config,
      }),
    );

    return {
      status: 'success',
      message: 'payment split registered successfully',
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
