import type { ApiCredential, Gateway } from '@prisma/client';
import { BuildGatewaySettingService } from './build-gateway-setting.service';
import { GatewayDefinitionService } from './gateway-definition.service';
import { GatewaySettingSecurityService } from './gateway-setting-security.service';
import { GatewaySettingViewService } from './gateway-setting-view.service';
import { GatewayPaymentMethodsService } from './gateway-payment-methods.service';

const definitions = new GatewayDefinitionService();
const security = {
  fields: jest.fn().mockReturnValue({}),
  urls: jest.fn().mockReturnValue({}),
} as unknown as GatewaySettingSecurityService;
const config = {
  supportedPaymentMethods: ['credit_card', 'pix', 'boleto', 'payment_link'],
};
const gateway = {
  unique_id: 'gateway',
  provider: 'stripe',
  name: 'Stripe',
  config,
} as unknown as Gateway;
const builder = new BuildGatewaySettingService(security);
const view = new GatewaySettingViewService(definitions, security);
const input = {
  environment: 'sandbox' as const,
  status: 'active' as const,
  modes: ['one_time' as const],
  defaultModes: [],
  fields: {},
};
const actor = { officeId: 'office', userCustomerId: 'owner' };

describe('Credential payment methods', () => {
  it('saves selected methods, always adds payment_link, and reloads the same selection', () => {
    const saved = builder.exec(
      null,
      actor,
      gateway,
      definitions.resolve('stripe'),
      { ...input, paymentMethods: ['pix'] },
    );
    expect((saved.config as Record<string, unknown>).paymentMethods).toEqual([
      'payment_link',
      'pix',
    ]);
    const result = view.build(gateway, [
      { ...saved, updated_at: new Date() } as unknown as ApiCredential,
    ]);
    expect(result.supportedPaymentMethods).toEqual(
      config.supportedPaymentMethods,
    );
    expect(result.credentials[0].paymentMethods).toEqual([
      'payment_link',
      'pix',
    ]);
  });
  it('replaces the previous selection instead of merging unchecked methods', () => {
    const old = {
      unique_id: 'credential',
      config: {
        managedHosted: true,
        paymentMethods: ['payment_link', 'pix', 'boleto'],
      },
    } as unknown as ApiCredential;
    const saved = builder.exec(
      old,
      actor,
      gateway,
      definitions.resolve('stripe'),
      { ...input, paymentMethods: ['credit_card'] },
    );
    expect((saved.config as Record<string, unknown>).paymentMethods).toEqual([
      'payment_link',
      'credit_card',
    ]);
  });
  it('keeps only the required link when all optional methods are unchecked', () => {
    expect(GatewayPaymentMethodsService.forSave(config, [], {})).toEqual([
      'payment_link',
    ]);
  });
  it('preserves supported selections when older clients omit the field', () => {
    expect(
      GatewayPaymentMethodsService.forSave(config, undefined, {
        paymentMethods: ['pix', 'removed_method'],
      }),
    ).toEqual(['payment_link', 'pix']);
  });
  it.each([['crypto'], ['Pix'], [true], 'pix', null, { pix: true }])(
    'rejects unsupported or malformed methods: %j',
    (value) => {
      expect(() =>
        GatewayPaymentMethodsService.forSave(config, value, {}),
      ).toThrow();
    },
  );
  it('uses the gateway catalog dynamically without inventing optional methods', () => {
    expect(
      GatewayPaymentMethodsService.supported({
        supportedPaymentMethods: ['new_method', 'new_method', 5, '<script>'],
      }),
    ).toEqual(['new_method']);
    expect(GatewayPaymentMethodsService.forSave({}, [], {})).toEqual([
      'payment_link',
    ]);
    expect(() =>
      GatewayPaymentMethodsService.forSave({}, ['pix'], {}),
    ).toThrow();
  });
});
