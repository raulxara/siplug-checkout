import { Injectable } from '@nestjs/common';
import { NormalizeApiCredentialConfigDtoIn } from './dtos/normalize-api-credential-config.dto-in';
import { NormalizeApiCredentialConfigDtoOut } from './dtos/normalize-api-credential-config.dto-out';

@Injectable()
export class NormalizeApiCredentialConfigService {
  exec(
    dtoIn: NormalizeApiCredentialConfigDtoIn,
  ): NormalizeApiCredentialConfigDtoOut {
    const baseConfig = dtoIn.config ?? {};

    const normalized: Record<string, unknown> = {
      ...baseConfig,
    };

    if (dtoIn.slug === 'siplug-log-api') {
      normalized.base_url = String(
        normalized.base_url ?? 'http://host.docker.internal:8080',
      );

      normalized.log_endpoint = String(
        normalized.log_endpoint ?? '/api/v1/log/register',
      );

      normalized.token_prefix = String(normalized.token_prefix ?? 'Bearer');

      normalized.timeout_seconds = Number(normalized.timeout_seconds ?? 15);

      normalized.expected_status_codes = Array.isArray(
        normalized.expected_status_codes,
      )
        ? normalized.expected_status_codes
        : [200, 201];

      normalized.headers =
        normalized.headers &&
        typeof normalized.headers === 'object' &&
        !Array.isArray(normalized.headers)
          ? normalized.headers
          : {};
    }

    return new NormalizeApiCredentialConfigDtoOut(normalized);
  }
}