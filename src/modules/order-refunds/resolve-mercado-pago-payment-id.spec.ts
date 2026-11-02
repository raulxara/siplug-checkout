import { ResolveActorAuthorizationService } from '../security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { resolveMercadoPagoPaymentId as resolve } from './resolve-mercado-pago-payment-id';
describe('Mercado Pago refund target', () => {
  it('accepts direct payments', () =>
    expect(resolve({ gateway_transaction_id: '123' })).toBe('123'));
  it('supports existing Checkout Pro records without rewriting their preference', () =>
    expect(
      resolve({
        gateway_transaction_id: '123-uuid',
        provider_response: { latestWebhookPayload: { payment: { id: 456 } } },
        gateway_response: { latestWebhook: { gatewayTransactionId: '456' } },
      }),
    ).toBe('456'));
  it('rejects preference-only records', () =>
    expect(() => resolve({ gateway_transaction_id: '123-uuid' })).toThrow(
      'REFUND_PAYMENT_ID_UNAVAILABLE',
    ));
  it('rejects conflicting IDs', () =>
    expect(() =>
      resolve({
        gateway_transaction_id: '123',
        provider_response: { latestWebhookPayload: { payment: { id: 456 } } },
      }),
    ).toThrow('REFUND_PAYMENT_ID_CONFLICT'));
  it('keeps the reserved refund target when later webhooks change', () =>
    expect(
      resolve({ gateway_transaction_id: '456' }, { gatewayPaymentId: '123' }),
    ).toBe('123'));
  it('does not use untrusted notification identifiers or unsafe numbers', () =>
    expect(() =>
      resolve({
        provider_response: {
          latestWebhookPayload: {
            notification: { data: { id: 123 } },
            payment: { id: Number.MAX_SAFE_INTEGER + 1 },
          },
        },
      }),
    ).toThrow());
});

describe('Refund authorization failures', () => {
  it('returns forbidden without converting permission denial into server failure', async () => {
    const service = new ResolveActorAuthorizationService(
      {
        exec: jest.fn().mockResolvedValue({
          userCustomer: { _id: 'actor', status: 'active' },
        }),
      } as never,
      { exec: jest.fn().mockResolvedValue({ allowed: false }) } as never,
    );
    await expect(
      service.exec({
        token: 'test',
        requiredEntity: 'payment_refunds',
        requiredAction: 'refundOrderPayment',
      } as never),
    ).rejects.toMatchObject({ status: 403 });
  });
});
