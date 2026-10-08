import { RestoreCouponRenewalsUseCase } from './restore-coupon-renewals.use-case';
describe('first payment coupon reconciliation', () => {
  function setup(paid = true) {
    const repo = {
      pending: jest
        .fn()
        .mockResolvedValue([
          {
            unique_id: 'session',
            office_id: 'office',
            client_id: 'client',
            external_reference: 'order',
            amount: 900,
            currency: 'BRL',
            gateway: { provider: 'mercadopago' },
            api_credential: { token: 'encrypted' },
            config: { renewalAmount: 1000 },
          },
        ]),
      subscription: jest
        .fn()
        .mockResolvedValue({
          unique_id: 'subscription',
          gateway_subscription_id: 'remote',
          status: 'active',
          invoices: paid ? [{ amount: 900, currency: 'BRL' }] : [],
        }),
      complete: jest.fn(),
      touched: jest.fn(),
    };
    const provider = { restore: jest.fn() };
    return {
      repo,
      provider,
      useCase: new RestoreCouponRenewalsUseCase(
        repo as never,
        provider as never,
      ),
    };
  }
  it('never adjusts when authorization has no confirmed paid invoice', async () => {
    const f = setup(false);
    await f.useCase.exec();
    expect(f.provider.restore).not.toHaveBeenCalled();
    expect(f.repo.complete).not.toHaveBeenCalled();
  });
  it('restores the gross amount only after verified first payment', async () => {
    const f = setup();
    await f.useCase.exec();
    expect(f.provider.restore).toHaveBeenCalledWith(
      expect.objectContaining({
        firstAmount: 900,
        renewalAmount: 1000,
        reference: 'order',
      }),
    );
    expect(f.repo.complete).toHaveBeenCalledWith(
      'session',
      'subscription',
      1000,
    );
  });
  it('keeps work pending when provider fails and retries later', async () => {
    const f = setup();
    f.provider.restore.mockRejectedValueOnce(new Error('timeout'));
    await f.useCase.exec();
    expect(f.repo.complete).not.toHaveBeenCalled();
    await f.useCase.exec();
    expect(f.repo.complete).toHaveBeenCalledTimes(1);
  });
  it('does not accept a paid invoice with another amount', async () => {
    const f = setup();
    f.repo.subscription.mockResolvedValueOnce({
      unique_id: 'subscription',
      gateway_subscription_id: 'remote',
      status: 'active',
      invoices: [{ amount: 10, currency: 'BRL' }],
    });
    await f.useCase.exec();
    expect(f.provider.restore).not.toHaveBeenCalled();
  });
});
