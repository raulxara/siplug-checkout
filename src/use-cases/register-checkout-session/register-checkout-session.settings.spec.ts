import { RegisterCheckoutSessionUseCase } from './register-checkout-session.use-case';
import { RegisterCheckoutSessionDtoIn } from './dtos/register-checkout-session.dto-in';
function setup() {
  const auth = {
    exec: jest.fn().mockResolvedValue({ actor: { clientId: 'client' } }),
  };
  const office = {
    exec: jest
      .fn()
      .mockResolvedValue({
        office: {
          status: 'active',
          config: {
            checkoutSettings: {
              currency: 'BRL',
              environment: 'sandbox',
              successUrl: 'https://shop.example/ok',
              cancelUrl: 'https://shop.example/cancel',
              sessionDurationMinutes: 60,
              version: 'v1',
            },
          },
        },
      }),
  };
  const client = {
    exec: jest
      .fn()
      .mockResolvedValue({ client: { status: 'active', officeId: 'office' } }),
  };
  const credential = {
    exec: jest
      .fn()
      .mockResolvedValue({
        apiCredential: {
          status: 'active',
          officeId: 'foreign',
          clientId: 'client',
          gatewayId: 'gateway',
        },
      }),
  };
  const gateway = {
    exec: jest
      .fn()
      .mockResolvedValue({
        gateway: { _id: 'gateway', status: 'active', config: {} },
      }),
  };
  const create = {
    exec: jest.fn(async (input) => ({ ...input, _id: 'session' })),
  };
  const noop = { exec: jest.fn().mockResolvedValue({}) };
  const service = new RegisterCheckoutSessionUseCase(
    auth as never,
    office as never,
    client as never,
    noop as never,
    gateway as never,
    credential as never,
    create as never,
    noop as never,
    noop as never,
    noop as never,
  );
  const input = new RegisterCheckoutSessionDtoIn({
    token: 'token',
    officeId: 'office',
    clientId: 'client',
    paymentType: 'one_time',
    amount: 100,
    currency: 'BRL',
    items: [{ name: 'Product', quantity: 1, unitAmount: 100 }],
  });
  return { service, input, auth, create };
}
it('applies company settings in the actual registration use case', async () => {
  const { service, input, create } = setup();
  await service.exec(input);
  expect(create.exec).toHaveBeenCalledWith(
    expect.objectContaining({
      currency: 'BRL',
      successUrl: 'https://shop.example/ok',
      config: expect.objectContaining({
        environment: 'sandbox',
        checkoutSettingsSnapshot: expect.objectContaining({ version: 'v1' }),
      }),
    }),
  );
});
it('refuses registration under another authenticated client', async () => {
  const { service, input, auth, create } = setup();
  auth.exec.mockResolvedValue({ actor: { clientId: 'foreign' } });
  await expect(service.exec(input)).rejects.toThrow('authenticated actor');
  expect(create.exec).not.toHaveBeenCalled();
});
it('refuses credentials from another office before creating the session', async () => {
  const { service, input, create } = setup();
  await expect(
    service.exec(
      new RegisterCheckoutSessionDtoIn({
        ...input,
        gatewayId: 'gateway',
        apiCredentialId: 'credential',
      }),
    ),
  ).rejects.toThrow('client office');
  expect(create.exec).not.toHaveBeenCalled();
});
