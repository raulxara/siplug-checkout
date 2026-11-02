import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';

import { RetryPaymentSplitDispatchDtoIn } from './dtos/retry-payment-split-dispatch.dto-in';
import type { RetryPaymentSplitDispatchRequest } from './http/retry-payment-split-dispatch.request';
import { RetryPaymentSplitDispatchUseCase } from './retry-payment-split-dispatch.use-case';

@Controller('payment-splits')
export class RetryPaymentSplitDispatchController {
  constructor(
    private readonly retryPaymentSplitDispatchUseCase: RetryPaymentSplitDispatchUseCase,
  ) {}

  @Post('retry-dispatch')
  @HttpCode(HttpStatus.OK)
  async handle(
    @Body() body: RetryPaymentSplitDispatchRequest,
    @Headers('authorization') authorization?: string,
  ) {
    const token =
      body.token ??
      authorization?.replace(/^Bearer\s+/i, '').trim() ??
      null;

    const result = await this.retryPaymentSplitDispatchUseCase.exec(
      new RetryPaymentSplitDispatchDtoIn({
        token,
        paymentSplitId: body.paymentSplitId,
        sourceTransactionId: body.sourceTransactionId,
        reason: body.reason,
      }),
    );

    return {
      success: true,
      message: result.message,
      data: {
        dispatched: result.dispatched,
        paymentSplit: result.paymentSplit,
        recipients: result.recipients,
        gatewayResult: result.gatewayResult,
      },
    };
  }
}