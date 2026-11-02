import { PagbankRefundAdapter } from './pagbank-refund.adapter';
import { PaypalRefundAdapter } from './paypal-refund.adapter';
import { StripeRefundAdapter } from './stripe-refund.adapter';
import { MultiGatewayRefundService } from '../multi-gateway-refund.service';
const payment: any = {
  unique_id: 'payment',
  amount: 500,
  currency: 'BRL',
  external_reference: 'order',
  gateway_transaction_id: 'I-ABC',
  api_credential: { provider: 'paypal' },
};
const refund: any = {
  unique_id: 'refund',
  amount: 200,
  status: 'created',
  metadata: { providerRefundedBefore: 0 },
};
function http() {
  return {
    environment: jest.fn(() => 'sandbox'),
    bearer: jest.fn(() => ({})),
    paypal: jest.fn(async () => ({
      base: 'https://api-m.sandbox.paypal.com',
      headers: {},
    })),
    json: jest.fn(),
  };
}
describe('Post-sale provider adapters', () => {
  it('PagBank preserves uncertainty when GET still shows no refund', async () => {
    const h = http(); h.json.mockResolvedValue({id:'CHAR_ABC', reference_id:'order', amount:{value:500,currency:'BRL',summary:{refunded:0}}});
    expect(await new PagbankRefundAdapter(h as never).poll(payment,'CHAR_ABC',refund)).toBeNull();
  });
  it('PagBank uses the bound charge, integer amount and the same idempotency key', async () => {
    const h = http();
    h.json.mockResolvedValue({
      id: 'CHAR_ABC',
      reference_id: 'order',
      amount: { value: 500, currency: 'BRL', summary: { refunded: 200 } },
    });
    expect(
      await new PagbankRefundAdapter(h as never).submit(
        payment,
        'CHAR_ABC',
        refund,
      ),
    ).toEqual({ id: 'CHAR_ABC', state: 'succeeded' });
    expect(h.json).toHaveBeenCalledWith(
      'https://sandbox.api.pagseguro.com/charges/CHAR_ABC/cancel',
      'POST',
      { 'x-idempotency-key': 'refund' },
      { amount: { value: 200 } },
    );
  });
  it.each([
    { reference_id: 'other' },
    { amount: { value: 600, currency: 'BRL', summary: { refunded: 0 } } },
    { amount: { value: 500, currency: 'USD', summary: { refunded: 0 } } },
  ])('PagBank rejects mismatched authoritative charge %j', async (patch) => {
    const h = http();
    h.json.mockResolvedValue({
      id: 'CHAR_ABC',
      status: 'PAID',
      reference_id: 'order',
      amount: { value: 500, currency: 'BRL', summary: { refunded: 0 } },
      ...patch,
    });
    await expect(
      new PagbankRefundAdapter(h as never).verify(payment, 'CHAR_ABC'),
    ).rejects.toThrow();
  });
  it('PagBank pending response does not mean refunded', async () => {
    const h = http();
    h.json.mockResolvedValue({
      id: 'CHAR_ABC',
      reference_id: 'order',
      amount: { value: 500, currency: 'BRL', summary: { refunded: 0 } },
    });
    expect(
      (
        await new PagbankRefundAdapter(h as never).poll(
          payment,
          'CHAR_ABC',
          { ...refund, gateway_refund_id: 'CHAR_ABC' },
        )
      ).state,
    ).toBe('processing');
  });
  it('PayPal subscription sales use v1 sale refunds, not subscription or order IDs', async () => {
    const h = http();
    h.json.mockResolvedValue({
      id: 'R123',
      sale_id: 'S123',
      state: 'completed',
      amount: { total: '2.00', currency: 'BRL' },
    });
    expect(
      await new PaypalRefundAdapter(h as never).submit(
        payment,
        'sale:S123',
        refund,
      ),
    ).toEqual({ id: 'R123', state: 'succeeded' });
    expect(h.json.mock.calls[0]).toEqual([
      'https://api-m.sandbox.paypal.com/v1/payments/sale/S123/refund',
      'POST',
      { 'PayPal-Request-Id': 'refund' },
      { amount: { total: '2.00', currency: 'BRL' } },
    ]);
  });
  it('PayPal capture refunds use v2 and validate the parent capture', async () => {
    const h = http();
    h.json.mockResolvedValue({
      id: 'R123',
      status: 'COMPLETED',
      amount: { value: '2.00', currency_code: 'BRL' },
      links: [
        {
          rel: 'up',
          href: 'https://api-m.sandbox.paypal.com/v2/payments/captures/C123',
        },
      ],
    });
    expect(
      (
        await new PaypalRefundAdapter(h as never).submit(
          payment,
          'capture:C123',
          refund,
        )
      ).state,
    ).toBe('succeeded');
    expect(h.json.mock.calls[0][0]).toContain(
      '/v2/payments/captures/C123/refund',
    );
  });
  it('PayPal rejects a response for another sale', async () => {
    const h = http();
    h.json.mockResolvedValue({
      id: 'R123',
      sale_id: 'OTHER',
      state: 'completed',
      amount: { total: '2.00', currency: 'BRL' },
    });
    await expect(
      new PaypalRefundAdapter(h as never).submit(payment, 'sale:S123', refund),
    ).rejects.toThrow();
  });
  it('PayPal does not repeat a POST when its result is unknown', async () => {
    const h = http();
    expect(
      await new PaypalRefundAdapter(h as never).poll(
        payment,
        'sale:S123',
        refund,
      ),
    ).toBeNull();
    expect(h.json).not.toHaveBeenCalled();
  });
  it('Stripe validates environment before refunding', async () => {
    const h = http();
    h.json.mockResolvedValue({
      id: 'ch_ABC',
      amount: 500,
      currency: 'brl',
      paid: true,
      captured: true,
      livemode: true,
      amount_refunded: 0,
    });
    await expect(
      new StripeRefundAdapter(h as never).verify(payment, 'ch_ABC'),
    ).rejects.toThrow();
  });
  it('Stripe persists request identity in refund metadata and maps pending', async () => {
    const h = http();
    h.json.mockResolvedValue({
      id: 're_ABC',
      charge: 'ch_ABC',
      amount: 200,
      currency: 'brl',
      status: 'pending',
      metadata: { siplugRefundId: 'refund' },
    });
    expect(
      (
        await new StripeRefundAdapter(h as never).submit(
          payment,
          'ch_ABC',
          refund,
        )
      ).state,
    ).toBe('processing');
    expect(h.json.mock.calls[0][2]['Idempotency-Key']).toBe('refund');
  });
  it('Stripe reconciles a lost response by request metadata without a second POST', async () => {
    const h = http();
    h.json.mockResolvedValue({
      data: [
        {
          id: 're_ABC',
          charge: 'ch_ABC',
          amount: 200,
          currency: 'brl',
          status: 'succeeded',
          metadata: { siplugRefundId: 'refund' },
        },
      ],
    });
    expect(
      (
        await new StripeRefundAdapter(h as never).poll(
          payment,
          'ch_ABC',
          refund,
        )
      )?.state,
    ).toBe('succeeded');
    expect(h.json.mock.calls[0][1]).toBe('GET');
  });
  it.each([
    ['paypal', 'CANCELLED'],
    ['stripe', 'canceled'],
  ])('%s cancellation confirms provider state', async (provider, status) => {
    const h = http(),
      id = provider === 'paypal' ? 'I-ABC' : 'sub_ABC';
    h.json.mockResolvedValue({ id, status, livemode: false });
    const a =
      provider === 'paypal'
        ? new PaypalRefundAdapter(h as never)
        : new StripeRefundAdapter(h as never);
    await a.cancel({
      gateway_subscription_id: id,
      api_credential: {},
    } as never);
    expect(h.json).toHaveBeenCalledTimes(1);
  });
});
describe('Multi-provider refund orchestration', () => {
  it('rejects changed credential environment before reaching the provider', async () => {
    const { uc, adapter } = setup();
    await expect(uc.exec('office','client',{...payment,config:{environment:'sandbox'},api_credential:{provider:'paypal',environment:'production'}},d)).rejects.toThrow('REFUND_ENVIRONMENT_MISMATCH');
    expect(adapter.verify).not.toHaveBeenCalled();
  });
  function setup(state = 'created') {
    let r: any = {
      ...refund,
      office_id: 'office',
      client_id: 'client',
      payment_transaction_id: 'payment',
      status: state,
      metadata: { gatewayPaymentId: 'sale:S123', providerRefundedBefore: 0 },
    };
    const repo: any = {
      findRefund: jest.fn(async () => r),
      reserve: jest.fn(async () => r),
      claimRefund: jest.fn(async () => ({ count: 1 })),
      requireRefund: jest.fn(async () => r),
      saveRefundResult: jest.fn(
        async (_id, state, id) =>
          (r = { ...r, status: state, gateway_refund_id: id }),
      ),
      projectConfirmed: jest.fn(),
    };
    const adapter: any = {
      verify: jest.fn(async () => ({ id: 'sale:S123', refunded: 0 })),
      submit: jest.fn(async () => ({ id: 'R123', state: 'succeeded' })),
      poll: jest.fn(async () => null),
    };
    return {
      repo,
      adapter,
      uc: new MultiGatewayRefundService(repo, adapter, adapter, adapter),
    };
  }
  const d = {
    requestId: 'refund',
    paymentId: 'payment',
    orderId: 'order',
    amount: 200,
  };
  it('does not dispatch after concurrent claim is lost', async () => {
    const { uc, adapter, repo } = setup();
    repo.claimRefund.mockResolvedValue({ count: 0 });
    await uc.exec('office', 'client', payment, d);
    expect(adapter.submit).not.toHaveBeenCalled();
  });
  it('never repeats an uncertain dispatch', async () => {
    const { uc, adapter } = setup('reconciliation_required');
    await uc.exec('office', 'client', payment, d);
    expect(adapter.submit).not.toHaveBeenCalled();
    expect(adapter.poll).toHaveBeenCalled();
  });
  it('rejects request-key reuse across tenants', async () => {
    const { uc, adapter } = setup();
    await expect(uc.exec('other', 'client', payment, d)).rejects.toThrow(
      'REFUND_KEY_REUSED',
    );
    expect(adapter.submit).not.toHaveBeenCalled();
  });
  it('rejects provider changes to refunded amount before dispatch', async () => {
    const { uc, adapter } = setup();
    adapter.verify.mockResolvedValue({ id: 'sale:S123', refunded: 100 });
    await uc.exec('office', 'client', payment, d);
    expect(adapter.submit).not.toHaveBeenCalled();
  });
  it('projects only confirmed refunds', async () => {
    const { uc, repo } = setup();
    expect((await uc.exec('office', 'client', payment, d)).state).toBe(
      'succeeded',
    );
    expect(repo.projectConfirmed).toHaveBeenCalledWith(
      'office',
      'client',
      'payment',
    );
  });
  it('does not release the reserved amount on transport failure', async () => {
    const { uc, adapter } = setup();
    adapter.submit.mockRejectedValue(new Error('timeout'));
    expect((await uc.exec('office', 'client', payment, d)).state).toBe(
      'reconciliation_required',
    );
  });
});
