import { CheckoutGeneralSettingsService as Settings } from './checkout-general-settings.service';
const values = {
  currency: 'BRL',
  environment: 'sandbox',
  successUrl: 'https://shop.example/return',
  cancelUrl: 'https://shop.example/cancel',
  sessionDurationMinutes: 60,
  version: 'v1',
};
beforeEach(() => {
  process.env.CHECKOUT_FRONTEND_URL = 'http://localhost:3000';
  process.env.CHECKOUT_PUBLIC_URL = 'http://localhost:8085';
});
describe('Company checkout configuration', () => {
  it('provides safe defaults without marking them as saved', () => {
    expect(Settings.read({ other: true })).toMatchObject({
      configured: false,
      version: 'initial',
      paymentMethod: 'payment_link',
      currency: 'BRL',
    });
  });
  it.each([
    'javascript:alert(1)',
    'http://shop.example/return',
    'https://user:password@shop.example',
    'https://127.0.0.1/return',
    'https://shop.local/return',
    'https://shop.example/?token=secret',
    'https://shop.example/#x',
  ])('rejects unsafe URL %s', (url) => {
    expect(() => Settings.validate({ ...values, successUrl: url })).toThrow();
  });
  it('rejects invalid currency and expiration', () => {
    for (const change of [
      { currency: 'USD' },
      { sessionDurationMinutes: 0 },
      { sessionDurationMinutes: 1441 },
      { sessionDurationMinutes: 30.5 },
    ])
      expect(() => Settings.validate({ ...values, ...change })).toThrow();
  });
  it('uses a server snapshot and overrides caller environment, currency, URLs and expiration', () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-10-05T12:00:00Z'));
    try {
      const result = Settings.apply(
        { checkoutSettings: values },
        {
          currency: 'USD',
          successUrl: 'https://evil.example',
          cancelUrl: null,
          expiresAt: null,
          config: {
            environment: 'production',
            subscription: { subscriptionPlanId: 'plan' },
          },
        },
      );
      expect(result).toMatchObject({
        currency: 'BRL',
        successUrl: values.successUrl,
        expiresAt: '2026-10-05T13:00:00.000Z',
        config: {
          environment: 'sandbox',
          subscription: { subscriptionPlanId: 'plan' },
        },
      });
      const forwarded = Settings.transactionConfig(result.config, {
        environment: 'production',
        successUrl: 'https://evil.example',
        returnUrl: 'https://evil.example',
        checkoutSettingsSnapshot: {},
      });
      expect(forwarded.successUrl).toBe(values.successUrl);
      expect(forwarded.environment).toBe('sandbox');
      expect(forwarded.returnUrl).toBeUndefined();
      expect(() => Settings.assertAvailable(result, 'credit_card')).toThrow();
      expect(() =>
        Settings.assertAvailable(result, 'payment_link'),
      ).not.toThrow();
      jest.advanceTimersByTime(3600000);
      expect(() => Settings.assertAvailable(result, 'payment_link')).toThrow(
        'expirada',
      );
    } finally {
      jest.useRealTimers();
    }
  });
  it('does not accept a forged snapshot on unconfigured companies', () => {
    const result = Settings.apply(
      {},
      {
        currency: 'BRL',
        successUrl: null,
        cancelUrl: null,
        expiresAt: null,
        config: { checkoutSettingsSnapshot: { expiresAt: '2099-01-01' } },
      },
    );
    expect(result.config.checkoutSettingsSnapshot).toBeUndefined();
  });
  it('keeps the PayPal capture callback separate from the buyer return page', () => {
    expect(
      Settings.paypalCaptureUrl('7d5a3462-851b-4bc4-9fd9-8aa43d6cd3b9'),
    ).toBe(
      'http://localhost:8085/api/v1/paypal/checkout/return/7d5a3462-851b-4bc4-9fd9-8aa43d6cd3b9',
    );
  });
});
