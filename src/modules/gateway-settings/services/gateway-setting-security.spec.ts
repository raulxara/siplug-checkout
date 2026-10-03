import { GatewayDefinitionService } from './gateway-definition.service';
import { GatewaySettingSecurityService } from './gateway-setting-security.service';
import { GatewaySettingViewService } from './gateway-setting-view.service';
import { EncryptApiCredentialSecretService } from '../../../common/services/crypto/encrypt-api-credential-secret/encrypt-api-credential-secret.service';
import { DecryptApiCredentialSecretService } from '../../../common/services/crypto/decrypt-api-credential-secret/decrypt-api-credential-secret.service';
import type { ApiCredential, Gateway } from '@prisma/client';
const definitions = new GatewayDefinitionService();
const security = new GatewaySettingSecurityService(
  new EncryptApiCredentialSecretService(),
  new DecryptApiCredentialSecretService(),
);
describe('Hosted gateway credential boundary', () => {
  beforeEach(() => {
    process.env.CRYPT_KEY = 'a'.repeat(32);
    process.env.CHECKOUT_PUBLIC_URL = 'https://checkout.example.test';
    process.env.CHECKOUT_FRONTEND_URL = 'https://app.example.test';
  });
  it('encrypts secrets and preserves an existing token on blank replacement', () => {
    const def = definitions.resolve('stripe');
    const saved = security.fields(
      def,
      { token: 'sk_test_secret', webhookSecret: 'whsec_secret' },
      {},
    );
    expect(saved.token).toMatch(/^enc::/);
    expect(JSON.stringify(saved)).not.toContain('sk_test_secret');
    expect(security.decrypt(saved.token as string)).toBe('sk_test_secret');
    expect(security.fields(def, { token: '' }, saved).token).toBe(saved.token);
  });
  it('rejects injected URL/config fields and client-supplied ciphertext', () => {
    const def = definitions.resolve('stripe');
    expect(() =>
      security.fields(def, { baseUrl: 'http://127.0.0.1' }, {}),
    ).toThrow();
    expect(() => security.fields(def, { token: 'enc::forged' }, {})).toThrow();
  });
  it('permits incomplete inactive draft but requires all fields before activation', () => {
    expect(() =>
      security.fields(definitions.resolve('picpay'), {}, {}, false),
    ).not.toThrow();
    expect(() =>
      security.fields(
        definitions.resolve('picpay'),
        { token: 'secret', clientId: 'client' },
        {},
      ),
    ).toThrow('webhook');
  });
  it('only exposes hosted capabilities', () => {
    expect(definitions.resolve('picpay').modes).toEqual(['one_time']);
    expect(definitions.resolve('pagbank').modes).toEqual(['one_time']);
    expect(definitions.resolve('stripe').modes).toContain('split_recurring');
    expect(definitions.resolve('infinitepay').modes).not.toContain('recurring');
  });
  it('uses official fixed PicPay production URL and refuses unsafe application origins', () => {
    expect(security.urls('picpay', 'production', 'uuid').baseUrl).toBe(
      'https://ecommerce-api.svc.picpay.com',
    );
    process.env.CHECKOUT_PUBLIC_URL = 'https://user:password@evil.test';
    expect(() => security.urls('stripe', 'sandbox', 'uuid')).toThrow();
  });
  it('never serializes stored secret, encrypted archive or history', () => {
    const gateway = {
      unique_id: 'gateway',
      provider: 'stripe',
      name: 'Stripe',
    } as Gateway;
    const row = {
      unique_id: 'credential',
      gateway_id: 'gateway',
      environment: 'sandbox',
      status: 'active',
      token: 'raw-secret',
      config: {
        webhookSecret: 'webhook-secret',
        previousConfigurationEncrypted: 'archive',
        enabledModes: ['one_time'],
        defaultModes: ['one_time'],
      },
      updated_at: new Date(),
      changes_history: [{ password: 'leak' }],
    } as unknown as ApiCredential;
    const value = new GatewaySettingViewService(definitions, security).build(
      gateway,
      [row],
    );
    const json = JSON.stringify(value);
    for (const secret of ['raw-secret', 'webhook-secret', 'archive', 'leak'])
      expect(json).not.toContain(secret);
    expect(value.credentials[0].configuredSecrets).toEqual([
      'token',
      'webhookSecret',
    ]);
  });
});
