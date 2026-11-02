import { MixedBillingService } from './mixed-billing.service';
import { HostedOrderRequest } from '../../../use-cases/hosted-orders/dtos/hosted-order.request';
import { HostedOrderResult } from '../entities/hosted-order.entity';
const input: HostedOrderRequest = {
  orderId: 'f213a152-5b2a-4ed0-9b93-dd011e6221b0',
  amount: 14489,
  paymentType: 'mixed',
  interval: 'month',
  intervalCount: 1,
  payer: { email: 'test@example.test' },
  items: [
    {
      itemRef: 'a',
      name: 'Avulso',
      quantity: 1,
      unitAmount: 9990,
      totalAmount: 9990,
      paymentType: 'one_time',
    },
    {
      itemRef: 'r',
      name: 'Plano',
      quantity: 1,
      unitAmount: 4499,
      totalAmount: 4499,
      paymentType: 'recurring',
    },
  ],
};
const result = (
  amount: number,
  status: string,
  url: string | null,
): HostedOrderResult => ({
  amount,
  status,
  checkoutUrl: url,
  checkoutSessionId: 'session',
  transactionId: 'tx',
  subscriptionId: null,
  currency: 'BRL',
  paidAt: null,
  validUntil: null,
  subscriptionStatus: null,
  renewalId: null,
});
describe('mixed billing', () => {
  it('keeps one-time items out of subscription and assigns stable distinct identity', () => {
    const [once, sub] = MixedBillingService.split(input);
    expect(once.amount).toBe(9990);
    expect(sub.amount).toBe(4499);
    expect(sub.items.map((i) => i.itemRef)).toEqual(['r']);
    expect(sub.orderId).not.toBe(input.orderId);
    expect(sub.orderId).toBe(MixedBillingService.split(input)[1].orderId);
  });
  it('allocates coupon discount to the corresponding payment only', () => {
    const [once, sub] = MixedBillingService.split({
      ...input,
      discount: 500,
      recurringDiscount: 200,
      cuponId: 'coupon',
      couponRecurrence: 'first_payment',
    });
    expect(once.discount).toBe(300);
    expect(sub.discount).toBe(200);
  });
  it('rejects unknown billing classes, multiple plans and inconsistent totals', () => {
    for (const bad of [
      { ...input, amount: 1 },
      {
        ...input,
        items: input.items.map((i) => ({ ...i, paymentType: undefined })),
      },
      { ...input, recurringDiscount: 200, discount: 100 },
      { ...input, items: [input.items[1], input.items[1]] },
    ])
      expect(() => MixedBillingService.split(bad)).toThrow();
  });
  it('offers only unpaid step after partial success and completes only after both payments', () => {
    const first = result(9990, 'paid', 'https://gateway/old');
    const sub = result(4499, 'pending', 'https://gateway/sub');
    expect(MixedBillingService.combine(first, sub, 14489)).toMatchObject({
      status: 'partially_paid',
      checkoutUrl: 'https://gateway/sub',
      nextPaymentType: 'recurring',
      amount: 14489,
    });
    expect(
      MixedBillingService.combine(first, { ...sub, status: 'paid' }, 14489),
    ).toMatchObject({ status: 'paid', checkoutUrl: null });
  });
  it('does not mark incomplete provisioning paid or reuse a paid link', () => {
    expect(
      MixedBillingService.combine(
        result(9990, 'paid', 'https://gateway/old'),
        null,
        14489,
      ),
    ).toMatchObject({ status: 'partially_paid', checkoutUrl: null });
  });
  it('preserves refund state and blocks redirect to a failed payment', () => {
    expect(
      MixedBillingService.combine(
        result(9990, 'refunded', null),
        result(4499, 'paid', null),
        14489,
      ).status,
    ).toBe('refunded');
    expect(
      MixedBillingService.combine(
        result(9990, 'paid', null),
        result(4499, 'rejected', 'https://gateway/rejected'),
        14489,
      ).checkoutUrl,
    ).toBeNull();
  });
});
