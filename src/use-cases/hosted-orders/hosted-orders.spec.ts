import { HostedOrdersUseCase } from './hosted-orders.use-case';
import { HostedOrderRequest } from './dtos/hosted-order.request';
describe('hosted purchases', () => {
  const input: HostedOrderRequest = {
    orderId: 'order',
    amount: 100,
    paymentType: 'recurring',
    interval: 'month',
    intervalCount: 1,
    items: [
      {
        itemRef: 'product',
        name: 'Plan',
        quantity: 1,
        unitAmount: 100,
        totalAmount: 100,
      },
    ],
    payer: { email: 'test@example.com' },
  };
  function fixture(result: Record<string, unknown>) {
    const repo = {
      reserve: jest.fn().mockResolvedValue(1),
      release: jest.fn(),
      session: jest.fn().mockResolvedValue({
        unique_id: 'session',
        items: [{ total_amount: 100 }],
      }),
      result: jest.fn().mockResolvedValue(result),
    };
    const payments = { exec: jest.fn() };
    const recurring = { exec: jest.fn() };
    const useCase = new HostedOrdersUseCase(
      {
        exec: jest
          .fn()
          .mockResolvedValue({ officeId: 'office', clientId: 'client' }),
      } as never,
      repo as never,
      {} as never,
      {} as never,
      payments as never,
      recurring as never,
    );
    return { repo, payments, recurring, useCase };
  }
  it('does not dispatch again when a transaction already exists', async () => {
    const f = fixture({ transactionId: 'existing' });
    await f.useCase.start('token', input);
    expect(f.recurring.exec).not.toHaveBeenCalled();
    expect(f.repo.release).toHaveBeenCalledWith(1);
  });
  it('blocks partial recurring creation instead of duplicating the subscription', async () => {
    const f = fixture({ subscriptionId: 'partial' });
    await expect(f.useCase.start('token', input)).rejects.toThrow(
      'parcialmente',
    );
    expect(f.recurring.exec).not.toHaveBeenCalled();
  });
  it('rejects inconsistent totals before reserving', async () => {
    const f = fixture({});
    await expect(
      f.useCase.start('token', { ...input, amount: 1 }),
    ).rejects.toThrow('Valores');
    expect(f.repo.reserve).not.toHaveBeenCalled();
  });
  it('always processes recurring through payment_link', async () => {
    const f = fixture({});
    await f.useCase.start('token', input);
    expect(f.recurring.exec).toHaveBeenCalledWith(
      expect.objectContaining({
        paymentMethod: 'payment_link',
        checkoutSessionId: 'session',
      }),
    );
    expect(f.payments.exec).not.toHaveBeenCalled();
  });
  it('persists Commerce coupon metadata with the discounted session', async () => {
    const sessions = { exec: jest.fn() };
    const repo = {
      reserve: jest.fn().mockResolvedValue(1),
      release: jest.fn(),
      gateway: jest
        .fn()
        .mockResolvedValue({ gateway_id: 'gateway', unique_id: 'credential' }),
      session: jest
        .fn()
        .mockResolvedValueOnce(null)
        .mockResolvedValue({
          unique_id: 'session',
          items: [{ total_amount: 100 }],
        }),
      result: jest.fn().mockResolvedValue({ transactionId: 'existing' }),
    };
    const u = new HostedOrdersUseCase(
      {
        exec: jest
          .fn()
          .mockResolvedValue({ officeId: 'office', clientId: 'client' }),
      } as never,
      repo as never,
      sessions as never,
      {} as never,
      {} as never,
      {} as never,
    );
    await u.start('token', {
      ...input,
      paymentType: 'one_time',
      cuponId: 'coupon',
      discount: 10,
    });
    expect(sessions.exec).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: 100,
        config: expect.objectContaining({ cuponId: 'coupon', discount: 10 }),
      }),
    );
  });
  it('records a first-payment adjustment only for Mercado Pago', async () => {
    const sessions = { exec: jest.fn() };
    const repo = {
      reserve: jest.fn().mockResolvedValue(1),
      release: jest.fn(),
      gateway: jest
        .fn()
        .mockResolvedValue({
          gateway_id: 'gateway',
          unique_id: 'credential',
          gateway: { provider: 'mercadopago' },
        }),
      plan: jest.fn().mockResolvedValue({ unique_id: 'plan' }),
      session: jest
        .fn()
        .mockResolvedValueOnce(null)
        .mockResolvedValue({
          unique_id: 'session',
          items: [{ total_amount: 100 }],
        }),
      result: jest.fn().mockResolvedValue({ transactionId: 'existing' }),
    };
    const u = new HostedOrdersUseCase(
      {
        exec: jest
          .fn()
          .mockResolvedValue({ officeId: 'office', clientId: 'client' }),
      } as never,
      repo as never,
      sessions as never,
      {} as never,
      {} as never,
      {} as never,
    );
    await u.start('token', {
      ...input,
      cuponId: 'coupon',
      discount: 10,
      couponRecurrence: 'first_payment',
    });
    expect(sessions.exec).toHaveBeenCalledWith(
      expect.objectContaining({
        config: expect.objectContaining({
          couponAdjustmentStatus: 'pending',
          renewalAmount: 110,
          couponRecurrence: 'first_payment',
        }),
      }),
    );
    repo.session.mockResolvedValueOnce(null);
    repo.gateway.mockResolvedValueOnce({
      gateway_id: 'gateway',
      unique_id: 'credential',
      gateway: { provider: 'stripe' },
    });
    await expect(
      u.start('token', {
        ...input,
        cuponId: 'coupon',
        discount: 10,
        couponRecurrence: 'first_payment',
      }),
    ).rejects.toThrow('COUPON_FIRST_PAYMENT_UNSUPPORTED');
  });
});
