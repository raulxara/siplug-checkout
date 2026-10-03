import { Injectable } from '@nestjs/common';
import { ApiCredential } from '@prisma/client';
import { GatewaySettingSecurityService } from './gateway-setting-security.service';
@Injectable()
export class GatewaySettingConnectionService {
  constructor(private readonly security: GatewaySettingSecurityService) {}
  async verify(provider: string, row: ApiCredential): Promise<string> {
    const config = (row.config ?? {}) as Record<string, unknown>;
    const env =
      (config.environment ?? row.environment) === 'production'
        ? 'production'
        : 'sandbox';
    const urls = this.security.urls(provider, env, row.unique_id);
    // InfinitePay has no authenticated read-only validation endpoint in this adapter.
    if (provider === 'infinitepay') return 'manual_validation_required';
    try {
      const token = this.security.decrypt(row.token ?? '');
      let url: string;
      let options: RequestInit = {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      };
      if (provider === 'stripe') url = urls.baseUrl + '/v1/account';
      else if (provider === 'mercadopago') url = urls.baseUrl + '/users/me';
      else if (provider === 'paypal') {
        url = urls.baseUrl + '/v1/oauth2/token';
        options = {
          method: 'POST',
          headers: {
            Authorization:
              'Basic ' +
              Buffer.from(String(config.clientId) + ':' + token).toString(
                'base64',
              ),
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: 'grant_type=client_credentials',
        };
      } else if (provider === 'picpay') {
        url = urls.tokenUrl;
        options = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            grant_type: 'client_credentials',
            client_id: config.clientId,
            client_secret: token,
          }),
        };
      } else return 'manual_validation_required';
      const response = await fetch(url, {
        ...options,
        redirect: 'error',
        signal: AbortSignal.timeout(8000),
      });
      await response.body?.cancel();
      return response.ok
        ? 'authenticated'
        : [401, 403].includes(response.status)
          ? 'rejected'
          : 'unavailable';
    } catch {
      return 'unavailable';
    }
  }
}
