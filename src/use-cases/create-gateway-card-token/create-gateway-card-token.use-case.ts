import { Injectable } from '@nestjs/common';

import { FindApiCredentialByUniqueIdDtoIn } from '../../modules/api-credentials/services/find-api-credential-by-unique-id/dtos/find-api-credential-by-unique-id.dto-in';
import { FindApiCredentialByUniqueIdService } from '../../modules/api-credentials/services/find-api-credential-by-unique-id/find-api-credential-by-unique-id.service';

import { CreateGatewayCardTokenDtoIn } from './dtos/create-gateway-card-token.dto-in';
import { CreateGatewayCardTokenDtoOut } from './dtos/create-gateway-card-token.dto-out';

type MercadoPagoCardTokenResponse = {
  id?: string;
  public_key?: string;
  first_six_digits?: string;
  last_four_digits?: string;
  expiration_month?: number;
  expiration_year?: number;
  status?: string;
  message?: string;
  error?: string;
  cause?: Array<{
    code?: number | string;
    description?: string;
    message?: string;
  }>;
  [key: string]: unknown;
};

@Injectable()
export class CreateGatewayCardTokenUseCase {
  constructor(
    private readonly findApiCredentialByUniqueIdService: FindApiCredentialByUniqueIdService,
  ) {}

  async exec(
    dtoIn: CreateGatewayCardTokenDtoIn,
  ): Promise<CreateGatewayCardTokenDtoOut> {
    this.ensureNonProductionEnvironment();

    const apiCredentialDtoOut =
      await this.findApiCredentialByUniqueIdService.exec(
        new FindApiCredentialByUniqueIdDtoIn(dtoIn.apiCredentialId),
      );

    const apiCredential = apiCredentialDtoOut.apiCredential;

    if (apiCredential.status !== 'active') {
      throw new Error('api credential is not active');
    }

    const publicKey = this.resolvePublicKey(apiCredential.config);

    const requestPayload = {
      card_number: dtoIn.cardNumber,
      security_code: dtoIn.securityCode,
      expiration_month: dtoIn.expirationMonth,
      expiration_year: dtoIn.expirationYear,
      cardholder: {
        name: dtoIn.cardholderName,
        identification: {
          type: dtoIn.documentType,
          number: dtoIn.documentValue,
        },
      },
    };

    const response = await fetch(
      `https://api.mercadopago.com/v1/card_tokens?public_key=${encodeURIComponent(
        publicKey,
      )}`,
      {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
      },
    );

    const responseBody = (await response.json().catch(() => ({
      message: 'Mercado Pago returned a non JSON response',
    }))) as MercadoPagoCardTokenResponse;

    if (!response.ok) {
      throw new Error(
        this.extractMercadoPagoErrorMessage(responseBody) ??
          `Mercado Pago card token request failed with status ${response.status}`,
      );
    }

    const cardToken = this.toNullableString(responseBody.id);

    if (cardToken === null) {
      throw new Error('Mercado Pago card token was not returned');
    }

    return new CreateGatewayCardTokenDtoOut(
      'mercado_pago',
      cardToken,
      this.maskPublicKey(publicKey),
      this.toNullableString(responseBody.first_six_digits),
      this.toNullableString(responseBody.last_four_digits),
      this.toNullableNumber(responseBody.expiration_month),
      this.toNullableNumber(responseBody.expiration_year),
      responseBody as Record<string, unknown>,
      {
        ok: true,
        httpStatus: response.status,
        endpoint: '/v1/card_tokens',
      },
    );
  }

  private ensureNonProductionEnvironment(): void {
    const nodeEnv = String(process.env.NODE_ENV ?? '').toLowerCase();
    const appEnv = String(process.env.APP_ENV ?? '').toLowerCase();

    const isProduction =
      nodeEnv === 'production' ||
      appEnv === 'production' ||
      appEnv === 'prod';

    if (isProduction) {
      throw new Error(
        'temporary card token endpoint is not allowed in production',
      );
    }
  }

  private resolvePublicKey(config: Record<string, unknown> | null): string {
    if (config === null) {
      throw new Error('api credential config is required');
    }

    const publicKey =
      this.toNullableString(config.publicKey) ??
      this.toNullableString(config.public_key) ??
      this.toNullableString(config.mercadoPagoPublicKey) ??
      this.toNullableString(config.mercado_pago_public_key);

    if (publicKey === null) {
      throw new Error('Mercado Pago publicKey is required in api credential config');
    }

    return publicKey;
  }

  private extractMercadoPagoErrorMessage(
    responseBody: MercadoPagoCardTokenResponse,
  ): string | null {
    const message = this.toNullableString(responseBody.message);

    if (message !== null) {
      return message;
    }

    const error = this.toNullableString(responseBody.error);

    if (error !== null) {
      return error;
    }

    const cause = responseBody.cause;

    if (Array.isArray(cause) && cause.length > 0) {
      const firstCause = cause[0];

      return (
        this.toNullableString(firstCause.description) ??
        this.toNullableString(firstCause.message) ??
        this.toNullableString(firstCause.code)
      );
    }

    return null;
  }

  private maskPublicKey(publicKey: string): string | null {
    if (publicKey.length <= 12) {
      return null;
    }

    return `${publicKey.slice(0, 8)}...${publicKey.slice(-4)}`;
  }

  private toNullableString(value: unknown): string | null {
    if (value === undefined || value === null) {
      return null;
    }

    const stringValue = String(value).trim();

    return stringValue === '' ? null : stringValue;
  }

  private toNullableNumber(value: unknown): number | null {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === 'string' && value.trim() !== '') {
      const parsed = Number(value);

      return Number.isFinite(parsed) ? parsed : null;
    }

    return null;
  }
}