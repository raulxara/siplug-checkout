import {
  Body,
  Controller,
  Headers,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common';

import { ReceivePayPalWebhookDtoIn } from './dtos/receive-paypal-webhook.dto-in';
import { ReceivePayPalWebhookUseCase } from './receive-paypal-webhook.use-case';

@Controller('webhooks/gateways')
export class ReceivePayPalWebhookController {
  constructor(
    private readonly receivePayPalWebhookUseCase: ReceivePayPalWebhookUseCase,
  ) {}

  @Post('paypal/:apiCredentialId')
  @HttpCode(200)
  async handle(
    @Param('apiCredentialId') apiCredentialId: string,
    @Body() body: Record<string, unknown>,
    @Headers() headers: Record<string, string | string[] | undefined>,
  ) {
    const dtoOut = await this.receivePayPalWebhookUseCase.exec(
      new ReceivePayPalWebhookDtoIn({
        apiCredentialId,
        payload: body,
        headers: this.normalizeHeaders(headers),
      }),
    );

    return {
      status: 'success',
      message: 'paypal webhook received successfully',
      data: {
        paymentWebhookEvent: dtoOut.paymentWebhookEvent,
        paymentTransaction: dtoOut.paymentTransaction,
        processingResult: dtoOut.processingResult,
        wasAlreadyRegistered: dtoOut.wasAlreadyRegistered,
      },
    };
  }

  private normalizeHeaders(
    headers: Record<string, string | string[] | undefined>,
  ): Record<string, unknown> {
    const normalized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(headers)) {
      normalized[key.toLowerCase()] = Array.isArray(value)
        ? value.join(',')
        : value;
    }

    return normalized;
  }
}
