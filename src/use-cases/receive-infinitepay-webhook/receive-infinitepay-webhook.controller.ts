import {
  Body,
  Controller,
  Headers,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common';

import { ReceiveInfinitePayWebhookDtoIn } from './dtos/receive-infinitepay-webhook.dto-in';
import { ReceiveInfinitePayWebhookUseCase } from './receive-infinitepay-webhook.use-case';

@Controller('webhooks/gateways')
export class ReceiveInfinitePayWebhookController {
  constructor(
    private readonly receiveInfinitePayWebhookUseCase: ReceiveInfinitePayWebhookUseCase,
  ) {}

  @Post([
    'infinitepay',
    'infinitepay/:apiCredentialId',
    'infinitypay',
    'infinitypay/:apiCredentialId',
  ])
  @HttpCode(200)
  async handle(
    @Param('apiCredentialId') apiCredentialId: string | undefined,
    @Body() body: Record<string, unknown>,
    @Headers() headers: Record<string, string | string[] | undefined>,
  ) {
    const dtoOut = await this.receiveInfinitePayWebhookUseCase.exec(
      new ReceiveInfinitePayWebhookDtoIn({
        apiCredentialId,
        payload: body,
        headers: this.normalizeHeaders(headers),
      }),
    );

    return {
      status: 'success',
      message: 'infinitepay webhook received successfully',
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
      normalized[key] = Array.isArray(value) ? value.join(',') : value;
    }

    return normalized;
  }
}
