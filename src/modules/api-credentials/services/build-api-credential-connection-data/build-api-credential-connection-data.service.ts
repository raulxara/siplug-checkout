import { Injectable } from '@nestjs/common';
import { DecryptApiCredentialSecretDtoIn } from '../../../../common/services/crypto/decrypt-api-credential-secret/dtos/decrypt-api-credential-secret.dto-in';
import { DecryptApiCredentialSecretService } from '../../../../common/services/crypto/decrypt-api-credential-secret/decrypt-api-credential-secret.service';
import { FindActiveApiCredentialBySlugDtoIn } from '../find-active-api-credential-by-slug/dtos/find-active-api-credential-by-slug.dto-in';
import { FindActiveApiCredentialBySlugService } from '../find-active-api-credential-by-slug/find-active-api-credential-by-slug.service';
import { BuildApiCredentialConnectionDataDtoIn } from './dtos/build-api-credential-connection-data.dto-in';
import { BuildApiCredentialConnectionDataDtoOut } from './dtos/build-api-credential-connection-data.dto-out';

@Injectable()
export class BuildApiCredentialConnectionDataService {
  constructor(
    private readonly findActiveApiCredentialBySlugService: FindActiveApiCredentialBySlugService,
    private readonly decryptApiCredentialSecretService: DecryptApiCredentialSecretService,
  ) {}

  async exec(
    dtoIn: BuildApiCredentialConnectionDataDtoIn,
  ): Promise<BuildApiCredentialConnectionDataDtoOut> {
    try {
      const credentialDtoOut =
        await this.findActiveApiCredentialBySlugService.exec(
          new FindActiveApiCredentialBySlugDtoIn(dtoIn.slug),
        );

      const credential = credentialDtoOut.apiCredential;
      const config = credential.config ?? {};

      const baseUrl = String(config.base_url ?? '').trim();
      const logEndpoint = String(config.log_endpoint ?? '').trim();
      const tokenPrefix = String(config.token_prefix ?? 'Bearer').trim();
      const timeoutSeconds = Number(config.timeout_seconds ?? 15);
      const rawHeaders = config.headers;
      const rawExpectedStatusCodes = config.expected_status_codes;

      const origin = credential.origin?.trim() ?? null;
      const rawToken = credential.token ?? '';

      if (baseUrl === '') {
        throw new Error('api credential base_url is required');
      }

      if (rawToken.trim() === '') {
        throw new Error('api credential token is required');
      }

      const decryptedDtoOut = this.decryptApiCredentialSecretService.exec(
        new DecryptApiCredentialSecretDtoIn({
          apiCredential: {
            config: {
              token: rawToken,
            },
          },
          keysToDecrypt: ['token'],
          encryptedPrefix: 'enc::',
          strict: true,
        }),
      );

      const decryptedConfig = decryptedDtoOut.apiCredential.config;

      if (
        !decryptedConfig ||
        typeof decryptedConfig !== 'object' ||
        Array.isArray(decryptedConfig)
      ) {
        throw new Error('api credential decrypted config is invalid');
      }

      const resolvedToken = String(
        (decryptedConfig as Record<string, unknown>).token ?? '',
      );

      if (resolvedToken.trim() === '') {
        throw new Error('api credential token could not be decrypted');
      }

      const resolvedUrl =
        logEndpoint !== ''
          ? `${baseUrl.replace(/\/+$/, '')}/${logEndpoint.replace(/^\/+/, '')}`
          : baseUrl.replace(/\/+$/, '');

      return new BuildApiCredentialConnectionDataDtoOut(
        resolvedUrl,
        resolvedToken,
        tokenPrefix === '' ? 'Bearer' : tokenPrefix,
        origin,
        timeoutSeconds > 0 ? timeoutSeconds : 15,
        this.parseHeaders(rawHeaders),
        this.parseExpectedStatusCodes(rawExpectedStatusCodes),
        credential,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on build api credential connection data';

      throw new Error(message);
    }
  }

  private parseHeaders(value: unknown): Record<string, string> {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return {};
    }

    const headers: Record<string, string> = {};

    for (const [key, headerValue] of Object.entries(
      value as Record<string, unknown>,
    )) {
      if (key.trim() === '') {
        continue;
      }

      headers[key] = String(headerValue);
    }

    return headers;
  }

  private parseExpectedStatusCodes(value: unknown): number[] {
    const values = Array.isArray(value) ? value : [200, 201];

    return [...new Set(values.map((item) => Number(item)).filter(Boolean))];
  }
}