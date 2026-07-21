import {
  Body,
  Controller,
  Headers,
  HttpCode,
  Param,
  Post,
  Query,
} from '@nestjs/common';

import { ReceiveMercadoPagoWebhookDtoIn } from './dtos/receive-mercado-pago-webhook.dto-in';
import { ReceiveMercadoPagoWebhookUseCase } from './receive-mercado-pago-webhook.use-case';

@Controller('webhooks/gateways')
export class ReceiveMercadoPagoWebhookController {
  constructor(
    private readonly receiveMercadoPagoWebhookUseCase: ReceiveMercadoPagoWebhookUseCase,
  ) {}

  @Post(['mercado-pago', 'mercado-pago/:apiCredentialId'])
  @HttpCode(200)
  async handle(
    @Param('apiCredentialId') apiCredentialId: string | undefined,
    @Body() body: Record<string, unknown>,
    @Query() queryParams: Record<string, unknown>,
    @Headers() headers: Record<string, string | string[] | undefined>,
  ) {
    const dtoOut = await this.receiveMercadoPagoWebhookUseCase.exec(
      new ReceiveMercadoPagoWebhookDtoIn({
        apiCredentialId: this.resolveApiCredentialId({
          apiCredentialId,
          queryParams,
        }),
        payload: body,
        queryParams,
        headers: this.normalizeHeaders(headers),
        xSignature: this.resolveHeader(headers, 'x-signature'),
        xRequestId: this.resolveHeader(headers, 'x-request-id'),
      }),
    );

    return {
      status: 'success',
      message: 'mercado pago webhook received successfully',
      data: {
        paymentWebhookEvent: dtoOut.paymentWebhookEvent,
        paymentTransaction: dtoOut.paymentTransaction,
        processingResult: dtoOut.processingResult,
        wasAlreadyRegistered: dtoOut.wasAlreadyRegistered,
      },
    };
  }

  private resolveApiCredentialId(params: {
    apiCredentialId: string | undefined;
    queryParams: Record<string, unknown>;
  }): string {
    const fromPath = String(params.apiCredentialId ?? '').trim();

    if (fromPath !== '') {
      return fromPath;
    }

    return (
      this.extractString(params.queryParams, 'apiCredentialId') ??
      this.extractString(params.queryParams, 'api_credential_id') ??
      this.extractString(params.queryParams, 'credentialId') ??
      this.extractString(params.queryParams, 'credential_id') ??
      ''
    );
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
      normalized[key] = Array.isArray(value) ? value[0] : value;
    }

    return normalized;
  }

  private extractString(
    object: Record<string, unknown>,
    key: string,
  ): string | null {
    const value = object[key];

    if (value === undefined || value === null) {
      return null;
    }

    const stringValue = String(value).trim();

    return stringValue === '' ? null : stringValue;
  }
}