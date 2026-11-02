import {
  mercadoPagoRefundBody,
  pagbankRefundBody,
  safeGatewayRequestId,
} from './refund-request-body';
import { RefundHttpService } from './providers/refund-http.service';
import { MercadoPagoRefundService } from './mercado-pago-refund.service';
describe('Refund request compatibility and diagnostics', () => {
  afterEach(() => jest.restoreAllMocks());
  it('preserves full MP refund and explicit partial amount semantics', () => {
    expect(mercadoPagoRefundBody(14990, true)).toEqual({});
    expect(mercadoPagoRefundBody(499, false)).toEqual({ amount: 4.99 });
  });
  it('keeps PagBank amounts in cents and split details only for split reversals', () => {
    expect(pagbankRefundBody(500)).toEqual({ amount: { value: 500 } });
    const splits = { method: 'FIXED', receivers: [{ amount: { value: 500 } }] };
    expect(pagbankRefundBody(500, splits)).toEqual({
      amount: { value: 500 },
      splits,
    });
  });
  it.each([0, -1, 1.5, NaN, Infinity])(
    'rejects invalid amount %s',
    (amount) => {
      expect(() => mercadoPagoRefundBody(amount, true)).toThrow();
      expect(() => pagbankRefundBody(amount)).toThrow();
    },
  );
  it('sends empty object for an explicitly full MP refund', async () => {
    const f = jest
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response('{}'));
    const service = new MercadoPagoRefundService({
      exec: () => ({ apiCredential: { config: { token: 'secret' } } }),
    } as never);
    await service.request(
      'encrypted',
      '123',
      'POST',
      'same-key',
      500,
      undefined,
      true,
    );
    expect(f).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ body: '{}' }),
    );
  });
  it('retains PagBank rejection code and correlation without private response text', async () => {
    jest
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(
        new Response(
          JSON.stringify({
            error_messages: [
              { code: '40008', description: 'private@example.com' },
            ],
          }),
          { status: 400, headers: { 'x-request-id': 'request-123' } },
        ),
      );
    const http = new RefundHttpService({} as never);
    await expect(
      http.json(
        'https://sandbox.api.pagseguro.com/charges/CHAR_123/cancel',
        'POST',
        {},
        {},
      ),
    ).rejects.toMatchObject({
      upstreamStatus: 400,
      providerCode: '40008',
      providerRequestId: 'request-123',
      message: 'REFUND_GATEWAY_REVIEW',
    });
  });
  it('does not retain arbitrary header text', () =>
    expect(
      safeGatewayRequestId(
        new Headers({ 'x-request-id': 'private@example.com' }),
      ),
    ).toBeNull());
});
