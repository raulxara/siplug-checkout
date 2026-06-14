import { Body, Controller, Headers, Put } from '@nestjs/common';

import { UpdatePaymentSplitLifecycleDtoIn } from './dtos/update-payment-split-lifecycle.dto-in';
import { UpdatePaymentSplitLifecycleRequest } from './http/update-payment-split-lifecycle.request';
import { UpdatePaymentSplitLifecycleUseCase } from './update-payment-split-lifecycle.use-case';

@Controller('payment-splits')
export class UpdatePaymentSplitLifecycleController {
  constructor(
    private readonly updatePaymentSplitLifecycleUseCase: UpdatePaymentSplitLifecycleUseCase,
  ) {}

  @Put('update-lifecycle')
  async handle(
    @Body() request: UpdatePaymentSplitLifecycleRequest,
    @Headers('authorization') authorization?: string,
  ) {
    const dtoOut = await this.updatePaymentSplitLifecycleUseCase.exec(
      new UpdatePaymentSplitLifecycleDtoIn({
        token: this.resolveToken(authorization, request.token),

        paymentSplitId: request.paymentSplitId,
        status: request.status,

        gatewaySplitId: request.gatewaySplitId,

        providerPayload: request.providerPayload,
        providerResponse: request.providerResponse,
        gatewayResponse: request.gatewayResponse,
        metadata: request.metadata,
        config: request.config,

        recipients: request.recipients,
      }),
    );

    return {
      status: 'success',
      message: 'payment split lifecycle updated successfully',
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
