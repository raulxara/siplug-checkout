import { SubscriptionRenewalsRepository } from './subscription-renewals.repository';
import { NormalizedPaymentWebhookEventDto } from '../../payment-webhook-events/dtos/normalized-payment-webhook-event.dto';
describe('subscription renewal reconciliation', () => {
  const event = new NormalizedPaymentWebhookEventDto({
    provider: 'mercado_pago',
    eventId: 'event',
    canonicalStatus: 'paid',
    gatewayTransactionId: 'payment-2',
    gatewaySubscriptionId: 'sub-provider',
    amount: 100,
    currency: 'BRL',
  });
  function fixture(existing: boolean, amount = 100) {
    const tx = {
      subscription: {
        findFirst: jest.fn().mockResolvedValue({
          id: 1,
          unique_id: 'sub',
          amount,
          currency: 'BRL',
          subscription_plan: { interval_type: 'month', interval_count: 1 },
        }),
      },
      $queryRaw: jest.fn(),
      subscriptionInvoice: {
        findFirst: jest
          .fn()
          .mockImplementation(
            ({ where }: { where: { gateway_invoice_id?: string } }) =>
              where.gateway_invoice_id
                ? existing
                  ? { unique_id: 'already' }
                  : null
                : { gateway_invoice_id: 'payment:payment-1' },
          ),
        create: jest.fn().mockResolvedValue({ unique_id: 'new-invoice' }),
      },
      subscriptionCycle: {
        findFirst: jest.fn().mockResolvedValue({
          cycle_number: 1,
          period_end: new Date('2026-02-28T00:00:00Z'),
        }),
        create: jest.fn().mockResolvedValue({ unique_id: 'cycle-2' }),
      },
    };
    const db = {
      paymentWebhookEvent: {
        findUnique: jest
          .fn()
          .mockResolvedValue({ metadata: { apiCredentialId: 'credential' } }),
      },
      apiCredential: {
        findUnique: jest.fn().mockResolvedValue({ office_id: 'office' }),
      },
      $transaction: async (fn: (t: typeof tx) => unknown) => fn(tx),
    };
    return { tx, repo: new SubscriptionRenewalsRepository(db as never) };
  }
  it('reuses a provider invoice on repeated events', async () => {
    const f = fixture(true);
    expect(await f.repo.ensure('webhook', event)).toBe('already');
    expect(f.tx.subscriptionCycle.create).not.toHaveBeenCalled();
  });
  it('creates one new period per invoice with credential scoped ownership', async () => {
    const f = fixture(false);
    await f.repo.ensure('webhook', event);
    expect(f.tx.subscription.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          office_id: 'office',
          api_credential_id: 'credential',
        }),
      }),
    );
    expect(f.tx.subscriptionCycle.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        cycle_number: 2,
        period_end: new Date('2026-03-28T00:00:00Z'),
      }),
    });
  });
  it('rejects amount mismatch before creating any invoice', async () => {
    const f = fixture(false, 200);
    await expect(f.repo.ensure('webhook', event)).rejects.toThrow('mismatch');
    expect(f.tx.subscriptionInvoice.create).not.toHaveBeenCalled();
  });
});
