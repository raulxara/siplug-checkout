import {
  MercadoPagoRefundService,
  RefundGatewayException,
} from './mercado-pago-refund.service';
describe('Refund gateway diagnostics', () => {
  afterEach(() => jest.restoreAllMocks());
  it('preserves a safe upstream rejection without exposing response contents', async () => {
    jest
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(
        new Response(
          JSON.stringify({ error: 'not_found', message: 'sensitive detail' }),
          { status: 404 },
        ),
      );
    const gateway = new MercadoPagoRefundService({
      exec: () => ({ apiCredential: { config: { token: 'secret' } } }),
    } as never);
    await expect(
      gateway.request('encrypted', '123', 'POST', 'same-request', 400),
    ).rejects.toMatchObject({
      upstreamStatus: 404,
      providerCode: 'not_found',
      message: 'REFUND_GATEWAY_REVIEW',
    });
    expect(fetch).toHaveBeenCalledWith(
      'https://api.mercadopago.com/v1/payments/123/refunds',
      expect.objectContaining({
        headers: expect.objectContaining({
          'X-Idempotency-Key': 'same-request',
        }),
        body: '{"amount":4}',
      }),
    );
  });
  it('does not persist arbitrary error text as a code', async () => {
    jest.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ error: 'private user@example.com' }), {
        status: 403,
      }),
    );
    const gateway = new MercadoPagoRefundService({
      exec: () => ({ apiCredential: { config: { token: 'secret' } } }),
    } as never);
    await expect(
      gateway.request('encrypted', '123', 'GET'),
    ).rejects.toMatchObject({ upstreamStatus: 403, providerCode: null });
  });
});

describe('Refund credential context', () => {
  afterEach(() => jest.restoreAllMocks());
  const remote = {
    id: 123,
    live_mode: true,
    collector_id: 77,
    status: 'approved',
    currency_id: 'BRL',
    transaction_amount: 10,
    transaction_amount_refunded: 0,
  };
  const expected = { amount: 1000, currency: 'BRL', amountToRefund: 400 };
  function setup(token: string, payment = remote, seller = 77) {
    const fetcher = jest
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response(JSON.stringify(payment)))
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: seller })));
    const gateway = new MercadoPagoRefundService({
      exec: () => ({ apiCredential: { config: { token } } }),
    } as never);
    return { gateway, fetcher };
  }
  it('blocks test credentials for live payments without a write', async () => {
    const { gateway, fetcher } = setup('TEST-example');
    await expect(
      gateway.preflight('encrypted', '123', expected),
    ).rejects.toThrow('REFUND_ENVIRONMENT_MISMATCH');
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher.mock.calls[0][1]?.method).toBe('GET');
  });
  it('accepts matching sandbox payment and seller', async () => {
    const { gateway } = setup('TEST-example', { ...remote, live_mode: false });
    await expect(
      gateway.preflight('encrypted', '123', expected),
    ).resolves.toEqual({
      paymentId: '123',
      liveMode: false,
      collectorId: '77',
    });
  });
  it('accepts live payments only with corresponding seller production credentials', async () => {
    const { gateway } = setup('APP_USR-example');
    await expect(
      gateway.preflight('encrypted', '123', expected),
    ).resolves.toEqual({ paymentId: '123', liveMode: true, collectorId: '77' });
  });
  it('rejects a different seller', async () => {
    const { gateway } = setup('APP_USR-example', remote, 88);
    await expect(
      gateway.preflight('encrypted', '123', expected),
    ).rejects.toThrow('REFUND_SELLER_MISMATCH');
  });
  it('rejects changed pinned context', async () => {
    const { gateway } = setup('APP_USR-example');
    await expect(
      gateway.preflight('encrypted', '123', {
        ...expected,
        context: { paymentId: '123', liveMode: true, collectorId: '88' },
      }),
    ).rejects.toThrow('REFUND_CONTEXT_MISMATCH');
  });
  it('rejects an amount already refunded remotely', async () => {
    const { gateway } = setup('APP_USR-example', {
      ...remote,
      transaction_amount_refunded: 8,
    });
    await expect(
      gateway.preflight('encrypted', '123', expected),
    ).rejects.toThrow('REFUND_PAYMENT_REVIEW');
  });
});
