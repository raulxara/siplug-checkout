import { ResolvePaymentGatewayCredentialService } from '../../gateway-orchestration/services/resolve-payment-gateway-credential/resolve-payment-gateway-credential.service';
import { ResolvePaymentGatewayCredentialDtoIn } from '../../gateway-orchestration/services/resolve-payment-gateway-credential/dtos/resolve-payment-gateway-credential.dto-in';
import type {
  IApiCredentialsRepository,
  ApiCredentialRow,
} from '../../api-credentials/entities/api-credentials-repository.interface';
import type { FindGatewayByUniqueIdService } from '../../gateways/services/find-gateway-by-unique-id/find-gateway-by-unique-id.service';
import type { DecryptApiCredentialSecretService } from '../../../common/services/crypto/decrypt-api-credential-secret/decrypt-api-credential-secret.service';
function setup() {
  const rows = [
    {
      _id: 'a',
      officeId: 'office',
      clientId: null,
      status: 'active',
      gatewayId: 'ga',
      token: 'encrypted',
      environment: 'sandbox',
      config: {
        managedHosted: true,
        enabledModes: ['one_time', 'split'],
        defaultModes: ['one_time'],
        paymentMethods: ['payment_link'],
      },
    },
    {
      _id: 'b',
      officeId: 'office',
      clientId: null,
      status: 'active',
      gatewayId: 'gb',
      token: 'encrypted',
      environment: 'sandbox',
      config: {
        managedHosted: true,
        enabledModes: ['one_time', 'split'],
        defaultModes: ['split'],
        paymentMethods: ['payment_link'],
      },
    },
  ] as unknown as ApiCredentialRow[];
  const repository = { getAllByOfficeId: jest.fn().mockResolvedValue(rows) };
  const gateways = {
    exec: jest
      .fn()
      .mockResolvedValue({
        gateway: {
          _id: 'gateway',
          status: 'active',
          provider: 'stripe',
          slug: 'stripe',
          config: {},
        },
      }),
  };
  const decrypt = {
    exec: jest
      .fn()
      .mockReturnValue({ apiCredential: { config: { token: 'secret' } } }),
  };
  return {
    rows,
    service: new ResolvePaymentGatewayCredentialService(
      repository as unknown as IApiCredentialsRepository,
      gateways as unknown as FindGatewayByUniqueIdService,
      decrypt as unknown as DecryptApiCredentialSecretService,
    ),
  };
}
const input = (extra: Record<string, unknown> = {}) =>
  new ResolvePaymentGatewayCredentialDtoIn({
    officeId: 'office',
    clientId: 'client',
    paymentType: 'one_time',
    paymentMethod: 'payment_link',
    ...extra,
  });
describe('Hosted gateway routing', () => {
  it('selects independent defaults for ordinary and split payments', async () => {
    const { service } = setup();
    expect((await service.exec(input())).apiCredential._id).toBe('a');
    expect(
      (await service.exec(input({ splitRequired: true }))).apiCredential._id,
    ).toBe('b');
  });
  it('does not mix production with sandbox', async () => {
    const { service } = setup();
    await expect(
      service.exec(input({ environment: 'production' })),
    ).rejects.toThrow('not found');
  });
  it('rejects direct card capture on managed credentials', async () => {
    const { service } = setup();
    await expect(
      service.exec(input({ paymentMethod: 'credit_card' })),
    ).rejects.toThrow('not found');
  });
  it('rejects unselected recurrence and inactive credentials', async () => {
    const { service, rows } = setup();
    await expect(
      service.exec(input({ paymentType: 'recurring' })),
    ).rejects.toThrow('not found');
    rows.forEach((r) => (r.status = 'inactive'));
    await expect(service.exec(input())).rejects.toThrow('not found');
  });
  it('requires an explicit default when several gateways compete', async () => {
    const { service, rows } = setup();
    rows.forEach((r) => (r.config!.defaultModes = []));
    await expect(service.exec(input())).rejects.toThrow('explicit default');
  });
});
