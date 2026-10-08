import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { EncryptApiCredentialSecretService } from '../../../common/services/crypto/encrypt-api-credential-secret/encrypt-api-credential-secret.service';
import { EncryptApiCredentialSecretDtoIn } from '../../../common/services/crypto/encrypt-api-credential-secret/dtos/encrypt-api-credential-secret.dto-in';
import { DecryptApiCredentialSecretService } from '../../../common/services/crypto/decrypt-api-credential-secret/decrypt-api-credential-secret.service';
import { DecryptApiCredentialSecretDtoIn } from '../../../common/services/crypto/decrypt-api-credential-secret/dtos/decrypt-api-credential-secret.dto-in';
import {
  Environment,
  GatewayDefinition,
} from '../entities/gateway-setting.entity';
export const SECRET_KEYS = [
  'token',
  'webhookSecret',
  'webhookToken',
  'sellerRefreshToken',
  'transparentToken',
  'clientSecret',
  'client_secret',
  'accessToken',
  'access_token',
  'testAccessToken',
  'sandboxAccessToken',
  'apiKey',
  'api_key',
  'privateKey',
  'private_key',
  'password',
  'secret',
  'client_token',
  'webhook_secret',
];
@Injectable()
export class GatewaySettingSecurityService {
  constructor(
    private readonly encryptor: EncryptApiCredentialSecretService,
    private readonly decryptor: DecryptApiCredentialSecretService,
  ) {}
  encrypt(value: string): string {
    if (value.startsWith('enc::')) return value;
    return (
      this.encryptor.exec(
        new EncryptApiCredentialSecretDtoIn({
          apiCredential: { config: { token: value } },
          keysToEncrypt: ['token'],
          strict: true,
        }),
      ).apiCredential.config as Record<string, string>
    ).token;
  }
  decrypt(value: string): string {
    return (
      this.decryptor.exec(
        new DecryptApiCredentialSecretDtoIn({
          apiCredential: { config: { token: value } },
          keysToDecrypt: ['token'],
          strict: true,
        }),
      ).apiCredential.config as Record<string, string>
    ).token;
  }
  fields(
    def: GatewayDefinition,
    input: Record<string, string>,
    existing: Record<string, unknown>,
    complete = true,
  ): Record<string, unknown> {
    const result = { ...existing };
    for (const [key, value] of Object.entries(input)) {
      const field = def.fields.find((f) => f.key === key);
      if (
        !field ||
        typeof value !== 'string' ||
        value.length > 4096 ||
        /[\r\n]/.test(value) ||
        value.startsWith('enc::')
      )
        throw new BadRequestException('Campo de credencial inválido.');
      if (field.secret && value.trim() === '') continue;
      if (!field.secret && value.length > 255)
        throw new BadRequestException('Campo muito longo.');
      result[key] = field.secret ? this.encrypt(value.trim()) : value.trim();
    }
    for (const field of def.fields)
      if (complete && field.required && !result[field.key])
        throw new BadRequestException('Preencha ' + field.label + '.');
    for (const key of SECRET_KEYS)
      if (typeof result[key] === 'string' && result[key])
        result[key] = this.encrypt(result[key] as string);
    if (
      result.handle &&
      def.provider === 'infinitepay' &&
      !/^[a-zA-Z0-9._-]{1,100}$/.test(String(result.handle))
    )
      throw new BadRequestException('Handle inválido.');
    return result;
  }
  notificationUrl(value: string, provider: string, id: string): string {
    if (value.length > 2048 || /[\s\\]/.test(value))
      throw new BadRequestException('Endereço de webhook inválido.');
    let url: URL;
    try {
      url = new URL(value);
    } catch {
      throw new BadRequestException('Endereço de webhook inválido.');
    }
    const path =
      provider === 'stripe'
        ? `/api/v1/webhooks/stripe/${id}`
        : `/api/v1/webhooks/gateways/${provider === 'mercadopago' ? 'mercado-pago' : provider}/${id}`;
    if (
      url.protocol !== 'https:' ||
      url.username ||
      url.password ||
      url.hash ||
      url.pathname !== path ||
      url.port ||
      url.hostname === 'localhost' ||
      /^[0-9.]+$/.test(url.hostname) ||
      url.hostname.includes(':') ||
      !url.hostname.includes('.') ||
      url.hostname.endsWith('.localhost') ||
      url.hostname.endsWith('.local')
    )
      throw new BadRequestException(
        'Use HTTPS e o caminho de webhook desta credencial.',
      );
    for (const key of url.searchParams.keys())
      if (key !== 'source_news')
        throw new BadRequestException('Parâmetro de webhook não permitido.');
    return url.toString();
  }

  urls(
    provider: string,
    environment: Environment,
    id: string,
  ): Record<string, string> {
    const root = this.origin('CHECKOUT_PUBLIC_URL');
    const front = this.origin('CHECKOUT_FRONTEND_URL');
    const sandbox = environment === 'sandbox';
    const base: Record<string, string> = {
      mercadopago: 'https://api.mercadopago.com',
      infinitepay: 'https://api.checkout.infinitepay.io',
      pagseguro: sandbox
        ? 'https://sandbox.api.pagseguro.com'
        : 'https://api.pagseguro.com',
      stripe: 'https://api.stripe.com',
      paypal: sandbox
        ? 'https://api-m.sandbox.paypal.com'
        : 'https://api-m.paypal.com',
      picpay: sandbox
        ? 'https://api.ms.qa.limbo.work'
        : 'https://ecommerce-api.svc.picpay.com',
    };
    const webhook =
      provider === 'stripe'
        ? `${root}/api/v1/webhooks/stripe/${id}`
        : `${root}/api/v1/webhooks/gateways/${provider === 'mercadopago' ? 'mercado-pago' : provider}/${id}`;
    const success = `${front}/pagamento/retorno`;
    const cancel = `${front}/pagamento/cancelado`;
    const result: Record<string, string> = {
      baseUrl: base[provider],
      notificationUrl: webhook,
      webhookUrl: webhook,
      successUrl: success,
      cancelUrl: cancel,
      redirectUrl: success,
      backUrl: success,
      returnUrl: success,
    };
    if (provider === 'paypal') {
      result.returnUrl = `${root}/api/v1/paypal/checkout/return/${id}`;
    }
    if (provider === 'picpay') {
      result.apiPath = sandbox ? '/sandbox/v1' : '/v1';
      result.tokenUrl = sandbox
        ? 'https://api.ms.qa.limbo.work/oauth2/token'
        : 'https://ecommerce-api.svc.picpay.com/oauth2/token';
    }
    if (provider === 'pagseguro') {
      result.checkoutNotificationUrl = webhook;
      result.paymentNotificationUrl = webhook;
    }
    return result;
  }
  private origin(key: string): string {
    const value = process.env[key];
    if (!value)
      throw new ServiceUnavailableException(
        'URLs públicas do Checkout não configuradas.',
      );
    let url: URL;
    try {
      url = new URL(value);
    } catch {
      throw new ServiceUnavailableException('URL pública inválida.');
    }
    if (
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      url.pathname !== '/' ||
      (url.protocol !== 'https:' &&
        !(
          process.env.NODE_ENV !== 'production' &&
          url.protocol === 'http:' &&
          ['localhost', '127.0.0.1'].includes(url.hostname)
        ))
    )
      throw new ServiceUnavailableException('URL pública inválida.');
    return url.origin;
  }
}
