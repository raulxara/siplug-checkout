import { GatewayPaymentDtoIn } from '../dtos/gateway-payment.dto-in';
import { GatewayRecurringPaymentDtoIn } from '../dtos/gateway-recurring-payment.dto-in';
import { MercadoPagoGatewayPaymentProvider } from './mercado-pago/mercado-pago-gateway-payment.provider';
import { PagSeguroGatewayPaymentProvider } from './pagseguro/pagseguro-gateway-payment.provider';
import { PagSeguroRecurringPaymentProvider } from './pagseguro/pagseguro-recurring-payment.provider';
import { StripeGatewayPaymentProvider } from './stripe/stripe-gateway-payment.provider';
import { StripeRecurringPaymentProvider } from './stripe/stripe-recurring-payment.provider';

//npm test -- native-split-payments.spec.ts --runInBand

const splitRecipients = [
  {
    splitRecipientId: 'producer-recipient',
    role: 'producer',
    amount: 8000,
    percentage: 80,
    config: {
      gatewayAccounts: {
        pagseguro: { accountId: 'ACCO_PRODUCER' },
        stripe: { accountId: 'acct_producer' },
      },
    },
  },
  {
    splitRecipientId: 'platform-recipient',
    role: 'platform',
    amount: 2000,
    percentage: 20,
    config: {
      gatewayAccounts: {
        pagseguro: { accountId: 'ACCO_PLATFORM' },
        stripe: { accountId: 'acct_platform' },
      },
    },
  },
];

const paymentTransaction = (paymentMethod: string, hasSplit = true) =>
  ({
    id: 1,
    _id: `transaction-${paymentMethod}`,
    officeId: 'office-id',
    clientId: 'client-id',
    checkoutSessionId: 'checkout-id',
    paymentCustomerId: 'customer-id',
    gatewayId: 'gateway-id',
    apiCredentialId: 'credential-id',
    gatewayTransactionId: null,
    externalReference: `reference-${paymentMethod}`,
    idempotencyKey: `idempotency-${paymentMethod}`,
    paymentType: 'one_time',
    paymentMethod,
    amount: 10000,
    currency: 'BRL',
    installments: null,
    installmentAmount: null,
    interestAmount: null,
    interestType: null,
    gatewayStatus: null,
    status: 'processing',
    processStatus: 'processing',
    processMessage: null,
    providerPayload: null,
    providerResponse: null,
    gatewayResponse: null,
    qrCode: null,
    qrCodeBase64: null,
    boletoUrl: null,
    checkoutUrl: null,
    splitRequired: hasSplit,
    hasSplit,
    paidAt: null,
    authorizedAt: null,
    canceledAt: null,
    failedAt: null,
    refundedAt: null,
    expiresAt: null,
    metadata: null,
    config: null,
    changesHistory: null,
    createdAt: null,
    updatedAt: null,
  }) as const;

const apiCredential = {
  _id: 'credential-id',
  slug: 'test',
  gatewayId: 'gateway-id',
  token: 'test-token',
  config: { baseUrl: 'https://gateway.test' },
  connectionData: null,
};

const payer = {
  name: 'Cliente de teste',
  email: 'cliente@example.test',
  documentValue: '12345678909',
  address: {
    street: 'Rua Teste',
    number: '1',
    neighborhood: 'Centro',
    city: 'Sao Paulo',
    regionCode: 'SP',
    postalCode: '01001000',
  },
};

describe('native split payment gateway payloads', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it.each(['pix', 'boleto'])(
    'sends PagSeguro one-time native split for %s without card token',
    async (paymentMethod) => {
      global.fetch = jest.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            id: `ORDER-${paymentMethod}`,
            status: 'WAITING',
            qr_codes:
              paymentMethod === 'pix'
                ? [{ id: 'QR-1', text: 'pix-copy-paste' }]
                : undefined,
            charges:
              paymentMethod === 'boleto'
                ? [{ id: 'CHARGE-1', status: 'WAITING' }]
                : undefined,
          }),
          { status: 201 },
        ),
      );

      const provider = new PagSeguroGatewayPaymentProvider();
      const result = await provider.processPayment(
        new GatewayPaymentDtoIn({
          gatewayProvider: 'pagseguro',
          gatewaySlug: 'pagseguro',
          paymentTransaction: paymentTransaction(paymentMethod),
          apiCredential,
          idempotencyKey: `idempotency-${paymentMethod}`,
          config: { apiCredentialConfig: apiCredential.config },
          providerPayload: {
            payer,
            paymentData: { method: paymentMethod },
            items: [{ name: 'Produto', quantity: 1, unitAmount: 10000 }],
            split: { calculationBase: 'gross_amount', recipients: splitRecipients },
          },
        }),
      );

      expect(result.success).toBe(true);
      const request = (global.fetch as jest.Mock).mock.calls[0][1];
      const body = JSON.parse(String(request.body)) as Record<string, unknown>;
      const split = paymentMethod === 'pix'
        ? (body.qr_codes as Array<Record<string, unknown>>)[0].splits
        : (body.charges as Array<Record<string, unknown>>)[0].splits;

      expect(split).toEqual({
        method: 'PERCENTAGE',
        receivers: [
          { account: { id: 'ACCO_PRODUCER' }, amount: { value: 80 } },
          { account: { id: 'ACCO_PLATFORM' }, amount: { value: 20 } },
        ],
      });
    },
  );

  it('sends Mercado Pago native split fee for PIX and payment link without card token', async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ id: 'MP-PIX', status: 'pending', point_of_interaction: { transaction_data: { qr_code: 'pix' } } }),
          { status: 201 },
        ),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ id: 'PREFERENCE-1', init_point: 'https://checkout.test' }), { status: 201 }),
      );

    const provider = new MercadoPagoGatewayPaymentProvider();
    for (const paymentMethod of ['pix', 'payment_link']) {
      const result = await provider.processPayment(
        new GatewayPaymentDtoIn({
          gatewayProvider: 'mercado_pago',
          gatewaySlug: 'mercado-pago',
          paymentTransaction: paymentTransaction(paymentMethod),
          apiCredential,
          idempotencyKey: `idempotency-${paymentMethod}`,
          config: { apiCredentialConfig: apiCredential.config },
          providerPayload: {
            payer,
            paymentData: { method: paymentMethod },
            items: [{ name: 'Produto', quantity: 1, unitAmount: 10000 }],
            mercadoPagoSplit: {
              enabled: true,
              marketplaceId: 'marketplace-id',
              paymentSplitId: 'split-id',
              applicationFeeAmountInCents: 2000,
              marketplaceFeeAmountInCents: 2000,
            },
          },
        }),
      );
      expect(result.success).toBe(true);
    }

    const pixBody = JSON.parse(String((global.fetch as jest.Mock).mock.calls[0][1].body));
    const linkBody = JSON.parse(String((global.fetch as jest.Mock).mock.calls[1][1].body));
    expect(pixBody).toEqual(expect.objectContaining({ application_fee: 20 }));
    expect(linkBody).toEqual(expect.objectContaining({ marketplace_fee: 20 }));
  });

  it.each(['payment_link', 'boleto'])(
    'creates Stripe one-time split checkout for %s without card token',
    async (paymentMethod) => {
      global.fetch = jest.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            id: `cs_${paymentMethod}`,
            url: 'https://checkout.test/session',
            status: 'open',
            payment_status: 'unpaid',
          }),
          { status: 200 },
        ),
      );

      const provider = new StripeGatewayPaymentProvider();
      const result = await provider.processPayment(
        new GatewayPaymentDtoIn({
          gatewayProvider: 'stripe',
          gatewaySlug: 'stripe',
          paymentTransaction: paymentTransaction(paymentMethod),
          apiCredential,
          idempotencyKey: `idempotency-${paymentMethod}`,
          config: {
            apiCredentialConfig: {
              ...apiCredential.config,
              successUrl: 'https://success.test/session_id={CHECKOUT_SESSION_ID}',
              cancelUrl: 'https://cancel.test',
            },
          },
          providerPayload: {
            payer,
            items: [{ name: 'Produto', quantity: 1, unitAmount: 10000 }],
            split: { calculationBase: 'gross_amount', recipients: splitRecipients },
          },
        }),
      );

      expect(result.success).toBe(true);
      expect(result.checkoutUrl).toBe('https://checkout.test/session');
      const body = new URLSearchParams(
        String((global.fetch as jest.Mock).mock.calls[0][1].body),
      );
      expect(body.get('mode')).toBe('payment');
      expect(body.get('payment_method_types[0]')).toBe(
        paymentMethod === 'boleto' ? 'boleto' : 'card',
      );
    },
  );

  it.each(['payment_link', 'boleto'])(
    'sends Stripe recurring native split for %s without card token',
    async (paymentMethod) => {
      global.fetch = jest.fn().mockResolvedValue(
        new Response(JSON.stringify({ id: 'cs_test', url: 'https://checkout.test/session', status: 'open', payment_status: 'unpaid' }), { status: 200 }),
      );

      const provider = new StripeRecurringPaymentProvider();
      const result = await provider.createSubscription(recurringDto('stripe', paymentMethod));

      expect(result.success).toBe(true);
      const encoded = String((global.fetch as jest.Mock).mock.calls[0][1].body);
      const body = new URLSearchParams(encoded);
      expect(body.get('subscription_data[transfer_data][destination]')).toBe('acct_producer');
      expect(body.get('subscription_data[transfer_data][amount_percent]')).toBe('80');
    },
  );

  it('sends PagSeguro recurring boleto native split without card token', async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({}), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: 'PLAN-1' }), { status: 201 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ customers: [{ id: 'CUST-1' }] }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: 'SUB-1', status: 'ACTIVE' }), { status: 201 }));

    const provider = new PagSeguroRecurringPaymentProvider();
    const result = await provider.createSubscription(recurringDto('pagseguro', 'boleto'));

    expect(result.success).toBe(true);
    const body = JSON.parse(String((global.fetch as jest.Mock).mock.calls[3][1].body));
    expect(body).toEqual(expect.objectContaining({
      split_enabled: true,
      splits: {
        method: 'PERCENTAGE',
        receivers: expect.arrayContaining([
          expect.objectContaining({ account: { id: 'ACCO_PRODUCER' }, amount: { value: 80 } }),
          expect.objectContaining({ account: { id: 'ACCO_PLATFORM' }, amount: { value: 20 } }),
        ]),
      },
    }));
  });
});

function recurringDto(provider: 'stripe' | 'pagseguro', paymentMethod: string): GatewayRecurringPaymentDtoIn {
  return new GatewayRecurringPaymentDtoIn({
    gatewayProvider: provider,
    gatewaySlug: provider,
    subscriptionPlan: {
      id: 1, _id: 'plan-id', officeId: 'office-id', clientId: 'client-id', gatewayId: 'gateway-id', apiCredentialId: 'credential-id', gatewayPlanId: null,
      name: 'Plano mensal', slug: 'plan', description: null, billingInterval: 'month', billingIntervalCount: 1, amount: 10000, currency: 'BRL', trialDays: null, maxBillingCycles: 12, paymentMethods: [paymentMethod], metadata: null, config: null, changesHistory: null, status: 'active', createdAt: null, updatedAt: null,
    },
    subscription: { _id: 'subscription-id', config: null } as never,
    subscriptionInvoice: { _id: 'invoice-id', config: null } as never,
    paymentTransaction: { ...paymentTransaction(paymentMethod), paymentType: 'recurring' },
    apiCredential,
    idempotencyKey: `recurring-${provider}-${paymentMethod}`,
    config: { apiCredentialConfig: { ...apiCredential.config, recurringNotificationUrl: 'https://webhook.test/pagseguro' } },
    providerPayload: {
      payer,
      paymentData: { method: paymentMethod },
      checkoutSession: { _id: 'checkout-id', successUrl: 'https://success.test', cancelUrl: 'https://cancel.test' },
      split: { calculationBase: 'gross_amount', recipients: splitRecipients },
    },
  });
}
