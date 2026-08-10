import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';

import { ReconcilePaymentSplitWithGatewayDtoIn } from './dtos/reconcile-payment-split-with-gateway.dto-in';
import type { ReconcilePaymentSplitWithGatewayRequest } from './http/reconcile-payment-split-with-gateway.request';
import { ReconcilePaymentSplitWithGatewayUseCase } from './reconcile-payment-split-with-gateway.use-case';

@Controller('payment-splits')
export class ReconcilePaymentSplitWithGatewayController {
  constructor(
    private readonly reconcilePaymentSplitWithGatewayUseCase: ReconcilePaymentSplitWithGatewayUseCase,
  ) {}

  @Post('reconcile-with-gateway')
  @HttpCode(HttpStatus.OK)
  async handle(
    @Body() body: ReconcilePaymentSplitWithGatewayRequest,
    @Headers('authorization') authorization?: string,
  ) {
    const token =
      body.token ??
      authorization?.replace(/^Bearer\s+/i, '').trim() ??
      null;

    const result = await this.reconcilePaymentSplitWithGatewayUseCase.exec(
      new ReconcilePaymentSplitWithGatewayDtoIn({
        token,
        paymentSplitId: body.paymentSplitId,
        persistResult: body.persistResult,
        reason: body.reason,
      }),
    );

    return {
      success: true,
      message: result.message,
      data: {
        reconciled: result.reconciled,
        status: result.status,
        paymentSplit: result.paymentSplit,
        recipientResults: result.recipientResults,
        summary: result.summary,
      },
    };
  }
}
