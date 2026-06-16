import {
  Body,
  Controller,
  Headers,
  HttpCode,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';

import { ReceiveStripeWebhookDtoIn } from './dtos/receive-stripe-webhook.dto-in';
import { ReceiveStripeWebhookUseCase } from './receive-stripe-webhook.use-case';

@Controller('webhooks')
export class ReceiveStripeWebhookController {
  constructor(
    private readonly receiveStripeWebhookUseCase: ReceiveStripeWebhookUseCase,
  ) {}

  @Post('stripe/:apiCredentialId')
  @HttpCode(200)
  async handle(
    @Param('apiCredentialId') apiCredentialId: string,
    @Req() request: RawBodyRequest<Request>,
    @Body() body: Record<string, unknown>,
    @Headers() headers: Record<string, string | string[] | undefined>,
  ) {
    const rawBody = this.resolveRawBody(request);
    const stripeSignature = this.resolveHeader(headers, 'stripe-signature');

    const dtoOut = await this.receiveStripeWebhookUseCase.exec(
      new ReceiveStripeWebhookDtoIn({
        apiCredentialId,
        rawBody,
        payload: body,
        headers: this.normalizeHeaders(headers),
        stripeSignature,
      }),
    );

    return {
      status: 'success',
      message: 'stripe webhook received successfully',
      data: {
        paymentWebhookEvent: dtoOut.paymentWebhookEvent,
        paymentTransaction: dtoOut.paymentTransaction,
        processingResult: dtoOut.processingResult,
        wasAlreadyRegistered: dtoOut.wasAlreadyRegistered,
      },
    };
  }

  private resolveRawBody(request: RawBodyRequest<Request>): string {
    const rawBody = request.rawBody;

    if (!rawBody) {
      throw new Error(
        'rawBody not found. Check NestFactory.create(AppModule, { rawBody: true })',
      );
    }

    return rawBody.toString('utf8');
  }

  private resolveHeader(
    headers: Record<string, string | string[] | undefined>,
    key: string,
  ): string {
    const value = headers[key];

    if (Array.isArray(value)) {
      return String(value[0] ?? '').trim();
    }

    return String(value ?? '').trim();
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
