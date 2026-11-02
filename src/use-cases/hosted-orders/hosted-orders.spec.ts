import { MixedBillingService } from '../../modules/hosted-orders/services/mixed-billing.service';
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
    const authorization = { exec: jest.fn().mockResolvedValue({}) };
    const useCase = new HostedOrdersUseCase(
      {forOrder: jest.fn().mockResolvedValue(undefined)} as never,
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
      authorization as never,
    );
    return { repo, payments, recurring, useCase, authorization };
  }
  it('checks recurring permission before reserving or dispatching a mixed order', async () => {
    const f = fixture({});
    f.authorization.exec.mockRejectedValue(new Error('actor does not have permission'));
    await expect(f.useCase.start('token', {...input, paymentType:'mixed'})).rejects.toThrow('permission');
    expect(f.repo.reserve).not.toHaveBeenCalled();
    expect(f.payments.exec).not.toHaveBeenCalled();
    expect(f.recurring.exec).not.toHaveBeenCalled();
  });
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
      {forOrder: jest.fn().mockResolvedValue(undefined)} as never,
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
      { exec: jest.fn().mockResolvedValue({}) } as never,
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
      gateway: jest.fn().mockResolvedValue({
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
      {forOrder: jest.fn().mockResolvedValue(undefined)} as never,
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
      { exec: jest.fn().mockResolvedValue({}) } as never,
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
  it('resumes a mixed order using existing transactions without dispatching either twice', async () => {
    const f = fixture({});
    const child = MixedBillingService.childId('parent');
    Object.assign(f.repo, {
      gateway: jest
        .fn()
        .mockResolvedValue({ gateway: { provider: 'mercadopago' } }),
    });
    f.repo.session.mockImplementation(
      async (_office: string, _client: string, id: string) => ({
        unique_id: id,
        config:
          id === 'parent'
            ? { mixedBilling: true, initialTotal: 300 }
            : { parentOrderId: 'parent' },
        items: [{ total_amount: id === 'parent' ? 200 : 100 }],
      }),
    );
    f.repo.result.mockImplementation(
      async (_office: string, _client: string, id: string) => ({
        transactionId: 'tx-' + id,
        subscriptionId: id === child ? 'sub' : null,
        status: id === 'parent' ? 'paid' : 'pending',
        amount: id === 'parent' ? 200 : 100,
        currency: 'BRL',
        checkoutUrl:
          id === child ? 'https://gateway/sub' : 'https://gateway/old',
      }),
    );
    const mixed: HostedOrderRequest = {
      ...input,
      orderId: 'parent',
      amount: 300,
      paymentType: 'mixed',
      items: [
        { ...input.items[0], paymentType: 'recurring' },
        {
          ...input.items[0],
          itemRef: 'addon',
          paymentType: 'one_time',
          unitAmount: 200,
          totalAmount: 200,
        },
      ],
    };
    expect(await f.useCase.start('token', mixed)).toMatchObject({
      status: 'partially_paid',
      amount: 300,
      checkoutUrl: 'https://gateway/sub',
    });
    expect(await f.useCase.start('token', mixed)).toMatchObject({
      status: 'partially_paid',
    });
    expect(f.recurring.exec).not.toHaveBeenCalled();
    expect(f.payments.exec).not.toHaveBeenCalled();
  });
});
