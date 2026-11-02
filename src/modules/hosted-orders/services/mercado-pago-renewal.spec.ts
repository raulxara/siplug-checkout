import { MercadoPagoRenewalService } from './mercado-pago-renewal.service';
describe('Mercado Pago coupon renewal amount', () => {
  const input = {
    token: 'encrypted',
    subscriptionId: 'sub',
    reference: 'order',
    firstAmount: 900,
    renewalAmount: 1000,
    currency: 'BRL',
  };
  const current = (amount: number) => ({
    id: 'sub',
    external_reference: 'order',
    status: 'authorized',
    auto_recurring: { transaction_amount: amount, currency_id: 'BRL' },
  });
  const service = () =>
    new MercadoPagoRenewalService({
      exec: () => ({ apiCredential: { config: { token: 'test' } } }),
    } as never);
  afterEach(() => jest.restoreAllMocks());
  it('updates the remote amount and requires confirmation', async () => {
    const fetcher = jest
      .spyOn(global, 'fetch')
      .mockResolvedValueOnce(new Response(JSON.stringify(current(9))))
      .mockResolvedValueOnce(new Response(JSON.stringify(current(10))));
    await service().restore(input);
    expect(fetcher.mock.calls[1][1]).toEqual(
      expect.objectContaining({
        method: 'PUT',
        redirect: 'error',
        body: JSON.stringify({
          auto_recurring: { transaction_amount: 10, currency_id: 'BRL' },
        }),
      }),
    );
  });
  it('retries safely after remote success and local failure', async () => {
    const fetcher = jest
      .spyOn(global, 'fetch')
      .mockResolvedValue(new Response(JSON.stringify(current(10))));
    await service().restore(input);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it('does not overwrite a subscription belonging to another order', async () => {
    const fetcher = jest
      .spyOn(global, 'fetch')
      .mockResolvedValue(
        new Response(
          JSON.stringify({ ...current(9), external_reference: 'other' }),
        ),
      );
    await expect(service().restore(input)).rejects.toThrow('match');
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
});
