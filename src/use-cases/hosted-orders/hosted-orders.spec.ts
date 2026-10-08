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
});
