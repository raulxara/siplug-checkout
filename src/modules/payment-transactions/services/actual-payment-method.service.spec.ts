import { ActualPaymentMethodService as Service } from './actual-payment-method.service';
describe('Actual payment instrument', () => {
  it.each([
    [
      'mercado_pago',
      {
        payment: { payment_type_id: 'bank_transfer', payment_method_id: 'pix' },
      },
      'pix',
    ],
    [
      'mercado_pago',
      { payment_type_id: 'credit_card', payment_method_id: 'visa' },
      'credit_card',
    ],
    [
      'stripe',
      { data: { object: { payment_method_details: { type: 'card' } } } },
      'card',
    ],
    [
      'pagseguro',
      { pagseguro: { charges: [{ payment_method: { type: 'BOLETO' } }] } },
      'boleto',
    ],
    [
      'picpay',
      { picpay: { data: { transactions: [{ paymentType: 'PIX' }] } } },
      'pix',
    ],
    ['infinitepay', { payment_method: 'credit_card' }, 'credit_card'],
    ['paypal', { resource: { payment_source: { paypal: {} } } }, 'paypal'],
  ])('extracts %s evidence', (provider, payload, expected) => {
    expect(Service.resolve(provider as string, payload)).toBe(expected);
  });
  it.each([
    ['stripe', { data: { object: { payment_method_types: ['card', 'pix'] } } }],
    ['paypal', { resource: { status: 'COMPLETED' } }],
    ['mercado_pago', { payment_method_id: 'visa' }],
    ['infinitepay', { payment_method: 'payment_link' }],
  ])('does not guess %s instrument', (provider, payload) => {
    expect(Service.resolve(provider as string, payload)).toBeNull();
  });
  it('does not replace known evidence with an empty update', () => {
    expect(
      Service.merge({ actualPaymentMethod: 'pix' }, 'stripe', {}),
    ).toBeUndefined();
    expect(
      Service.merge({ source: 'existing' }, 'mercado_pago', {
        payment_type_id: 'credit_card',
      }),
    ).toEqual({ source: 'existing', actualPaymentMethod: 'credit_card' });
  });
});
