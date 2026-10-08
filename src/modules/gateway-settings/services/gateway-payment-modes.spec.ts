import type { ApiCredential, Gateway } from '@prisma/client';
import { BuildGatewaySettingService } from './build-gateway-setting.service';
import { GatewayDefinitionService } from './gateway-definition.service';
import { GatewaySettingSecurityService } from './gateway-setting-security.service';
import { GatewaySettingViewService } from './gateway-setting-view.service';
import { GatewayPaymentModesService } from './gateway-payment-modes.service';
import { PaymentMode } from '../entities/gateway-setting.entity';

const definitions = new GatewayDefinitionService();
const security = {
  fields: jest.fn().mockReturnValue({}),
  urls: jest.fn().mockReturnValue({}),
} as unknown as GatewaySettingSecurityService;
const gateway = {
  unique_id: 'gateway',
  name: 'Stripe',
  provider: 'stripe',
} as Gateway;
const builder = new BuildGatewaySettingService(security);
const view = new GatewaySettingViewService(definitions, security);
const modes: PaymentMode[] = [
  'one_time',
  'recurring',
  'split',
  'split_recurring',
];
const keys = [
  'supportsOneTimePayment',
  'supportsRecurringPayment',
  'supportsSplitPayment',
  'supportsSplitRecurringPayment',
];

describe('Credential payment preferences', () => {
  it.each(modes)(
    'persists and reloads only the selected modality: %s',
    (mode) => {
      const saved = builder.exec(
        null,
        { officeId: 'office', userCustomerId: 'actor' },
        gateway,
        definitions.resolve('stripe'),
        {
          environment: 'sandbox',
          status: 'active',
          modes: [mode],
          defaultModes: [],
          fields: {},
        },
      );
      const config = saved.config as Record<string, unknown>;
      keys.forEach((key, index) =>
        expect(config[key]).toBe(modes[index] === mode),
      );
      expect(saved.status).toBe('active');
      const row = {
        ...saved,
        updated_at: new Date(),
      } as unknown as ApiCredential;
      expect(view.build(gateway, [row]).credentials[0]).toMatchObject({
        status: 'active',
        modes: [mode],
      });
    },
  );
  it('disables the credential and clears all unchecked modalities and defaults', () => {
    const saved = builder.exec(
      null,
      { officeId: 'office', userCustomerId: 'actor' },
      gateway,
      definitions.resolve('stripe'),
      {
        environment: 'sandbox',
        status: 'inactive',
        modes: [],
        defaultModes: [],
        fields: {},
      },
    );
    expect(saved.status).toBe('inactive');
    keys.forEach((key) =>
      expect((saved.config as Record<string, unknown>)[key]).toBe(false),
    );
    expect((saved.config as Record<string, unknown>).defaultModes).toEqual([]);
  });
  it('prefers booleans to a stale list and rejects truthy strings', () => {
    expect(
      GatewayPaymentModesService.enabled({
        enabledModes: modes,
        supportsOneTimePayment: false,
        supportsRecurringPayment: 'true',
        supportsSplitPayment: true,
        supportsSplitRecurringPayment: false,
      }),
    ).toEqual(['split']);
  });
  it('loads existing records that only have enabledModes', () => {
    expect(
      GatewayPaymentModesService.enabled({
        enabledModes: ['one_time', 'split', 'unknown'],
      }),
    ).toEqual(['one_time', 'split']);
  });
  it('reads flag-only records and excludes unsupported provider modalities', () => {
    const row = {
      unique_id: 'credential',
      gateway_id: 'gateway',
      status: 'active',
      environment: 'sandbox',
      config: { supportsOneTimePayment: true, supportsRecurringPayment: true },
      updated_at: new Date(),
    } as unknown as ApiCredential;
    expect(
      view.build({ ...gateway, provider: 'picpay' }, [row]).credentials[0]
        .modes,
    ).toEqual(['one_time']);
  });
});
