import { safeGatewayRequestId } from '../refund-request-body';
import { Injectable } from '@nestjs/common';
import { ApiCredential } from '@prisma/client';
import { DecryptApiCredentialSecretService } from '../../../common/services/crypto/decrypt-api-credential-secret/decrypt-api-credential-secret.service';
import { DecryptApiCredentialSecretDtoIn } from '../../../common/services/crypto/decrypt-api-credential-secret/dtos/decrypt-api-credential-secret.dto-in';
import { RefundGatewayException } from '../mercado-pago-refund.service';
import { object } from './refund-contract';
@Injectable()
export class RefundHttpService {
  constructor(private readonly crypto: DecryptApiCredentialSecretService) {}
  environment(c: ApiCredential) {
    const e = object(c.config).environment ?? c.environment;
    if (!['sandbox', 'production'].includes(e))
      throw new Error('REFUND_ENVIRONMENT_UNVERIFIED');
    return e;
  }
  secret(c: ApiCredential) {
    const result = this.crypto.exec(
      new DecryptApiCredentialSecretDtoIn({
        apiCredential: { config: { token: c.token } },
        keysToDecrypt: ['token'],
        strict: true,
      }),
    );
    const token = object(result.apiCredential.config).token;
    if (typeof token !== 'string' || !token)
      throw new Error('REFUND_CREDENTIAL_INVALID');
    return token;
  }
  async json(
    url: string,
    method: string,
    headers: Record<string, string>,
    body?: unknown,
  ) {
    const r = await fetch(url, {
      method,
      headers,
      body:
        body === undefined
          ? undefined
          : typeof body === 'string'
            ? body
            : JSON.stringify(body),
      redirect: 'error',
      signal: AbortSignal.timeout(15000),
    });
    if (!r.ok) {
      const error = object(await r.json().catch(() => null));
      const raw =
        error.error_messages?.[0]?.code ??
        error.name ??
        error.error?.code ??
        error.code;
      const code =
        (typeof raw === 'string' || typeof raw === 'number') &&
        /^[a-zA-Z0-9_.-]{1,100}$/.test(String(raw))
          ? String(raw)
          : null;
      throw new RefundGatewayException(
        r.status,
        code,
        safeGatewayRequestId(r.headers),
      );
    }
    if (r.status === 204) return {};
    return object(await r.json());
  }
  async paypal(c: ApiCredential) {
    const base =
      this.environment(c) === 'sandbox'
        ? 'https://api-m.sandbox.paypal.com'
        : 'https://api-m.paypal.com';
    const cfg = object(c.config);
    const client = cfg.clientId ?? cfg.client_id;
    if (typeof client !== 'string' || !client)
      throw new Error('REFUND_CREDENTIAL_INVALID');
    const auth = await this.json(
      base + '/v1/oauth2/token',
      'POST',
      {
        Authorization:
          'Basic ' +
          Buffer.from(client + ':' + this.secret(c)).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      'grant_type=client_credentials',
    );
    if (typeof auth.access_token !== 'string')
      throw new Error('REFUND_CREDENTIAL_INVALID');
    return {
      base,
      headers: {
        Authorization: 'Bearer ' + auth.access_token,
        'Content-Type': 'application/json',
      },
    };
  }
  bearer(c: ApiCredential) {
    return {
      Authorization: 'Bearer ' + this.secret(c),
      'Content-Type': 'application/json',
    };
  }
}
