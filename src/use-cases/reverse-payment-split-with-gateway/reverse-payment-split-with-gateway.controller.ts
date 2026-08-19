import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';

import { ReversePaymentSplitWithGatewayDtoIn } from './dtos/reverse-payment-split-with-gateway.dto-in';
import type { ReversePaymentSplitWithGatewayRequest } from './http/reverse-payment-split-with-gateway.request';
import { ReversePaymentSplitWithGatewayUseCase } from './reverse-payment-split-with-gateway.use-case';

@Controller('payment-splits')
export class ReversePaymentSplitWithGatewayController {
  constructor(
    private readonly reversePaymentSplitWithGatewayUseCase: ReversePaymentSplitWithGatewayUseCase,
  ) {}

  @Post('reverse-with-gateway')
  @HttpCode(HttpStatus.OK)
  async handle(
    @Body() body: ReversePaymentSplitWithGatewayRequest,
    @Headers('authorization') authorization?: string,
  ) {
    const token =
      body.token ??
      authorization?.replace(/^Bearer\s+/i, '').trim() ??
      null;

    const result = await this.reversePaymentSplitWithGatewayUseCase.exec(
      new ReversePaymentSplitWithGatewayDtoIn({
        token,
        paymentSplitId: body.paymentSplitId,
        reversalAmount: body.reversalAmount,
        reason: body.reason,
        idempotencyKey: body.idempotencyKey,
        force: body.force,
      }),
    );

    return {
      success: true,
      message: result.message,
      data: {
        reversed: result.reversed,
        status: result.status,
        paymentSplit: result.paymentSplit,
        recipientResults: result.recipientResults,
        summary: result.summary,
      },
    };
  }
}