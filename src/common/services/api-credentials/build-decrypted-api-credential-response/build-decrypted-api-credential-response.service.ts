import { Injectable } from '@nestjs/common';

import { DecryptApiCredentialSecretDtoIn } from '../../crypto/decrypt-api-credential-secret/dtos/decrypt-api-credential-secret.dto-in';
import { DecryptApiCredentialSecretService } from '../../crypto/decrypt-api-credential-secret/decrypt-api-credential-secret.service';
import type { ApiCredentialRow } from '../../../../modules/api-credentials/entities/api-credentials-repository.interface';

@Injectable()
export class BuildDecryptedApiCredentialResponseService {
  private readonly secretKeys = [
    'client_token',
    'token',
    'secret',
    'password',
    'apiKey',
    'api_key',
    'clientSecret',
    'client_secret',
    'accessToken',
    'access_token',
    'refreshToken',
    'refresh_token',
    'privateKey',
    'private_key',
    'webhookSecret',
    'webhook_secret',
    'webhookToken',
    'webhook_token',
  ];

  constructor(
    private readonly decryptApiCredentialSecretService: DecryptApiCredentialSecretService,
  ) {}

  exec(apiCredential: ApiCredentialRow): Record<string, unknown> {
    return {
      id: apiCredential.id,
      _id: apiCredential._id,
      officeId: apiCredential.officeId,
      clientId: apiCredential.clientId,
      gatewayId: apiCredential.gatewayId,
      name: apiCredential.name,
      slug: apiCredential.slug,
      provider: apiCredential.provider,
      providerType: apiCredential.providerType,
      environment: apiCredential.environment,
      token: this.decryptToken(apiCredential.token),
      origin: apiCredential.origin,
      config: this.decryptConfig(apiCredential.config),
      expiresAt: apiCredential.expiresAt,
      changesHistory: apiCredential.changesHistory,
      status: apiCredential.status,
      createdAt: apiCredential.createdAt,
      updatedAt: apiCredential.updatedAt,
      secretsDecrypted: true,
    };
  }

  private decryptToken(token: string | null): string | null {
    if (token === null || token.trim() === '') {
      return null;
    }

    const decryptedDtoOut = this.decryptApiCredentialSecretService.exec(
      new DecryptApiCredentialSecretDtoIn({
        apiCredential: {
          config: {
            token,
          },
        },
        keysToDecrypt: ['token'],
        strict: false,
      }),
    );

    const config = this.toRecordOrNull(decryptedDtoOut.apiCredential.config);

    return this.extractString(config, 'token');
  }

  private decryptConfig(
    config: Record<string, unknown> | null,
  ): Record<string, unknown> | null {
    if (config === null) {
      return null;
    }

    const decryptedDtoOut = this.decryptApiCredentialSecretService.exec(
      new DecryptApiCredentialSecretDtoIn({
        apiCredential: {
          config,
        },
        keysToDecrypt: this.secretKeys,
        strict: false,
      }),
    );

    return this.toRecordOrNull(decryptedDtoOut.apiCredential.config);
  }

  private toRecordOrNull(value: unknown): Record<string, unknown> | null {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return null;
    }

    return value as Record<string, unknown>;
  }

  private extractString(
    object: Record<string, unknown> | null,
    key: string,
  ): string | null {
    if (object === null) {
      return null;
    }

    const value = object[key];

    if (value === undefined || value === null) {
      return null;
    }

    const normalized = String(value).trim();

    return normalized === '' ? null : normalized;
  }
}