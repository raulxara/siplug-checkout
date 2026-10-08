import { ReceiveMercadoPagoWebhookUseCase } from './receive-mercado-pago-webhook.use-case';
describe('Mercado Pago recurring resource routing', () => {
  const service = Object.create(ReceiveMercadoPagoWebhookUseCase.prototype);
  afterEach(() => jest.restoreAllMocks());
  it('routes invoice notifications to authorized payments, not preapprovals', () => {
    expect(service.resolveResourceType({ payload: { type: 'subscription_authorized_payment' }, queryParams: {} })).toBe('authorized_payment');
    expect(service.resolveResourceType({ payload: { type: 'subscription_preapproval' }, queryParams: {} })).toBe('preapproval');
  });
  it('uses the payment API as authority and retains subscription and invoice linkage', async () => {
    const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue(new Response(JSON.stringify({ id: 42, preapproval_id: 'sub-1', payment: { id: 100 } }), {status: 200}));
    service.getMercadoPagoPaymentService = { exec: jest.fn().mockResolvedValue({ payment: { id: 100, status: 'approved', transaction_amount: 59.9, currency_id: 'BRL' }, providerResponse: {} }) };
    const result = await service.resolveMercadoPagoResource({ resourceType: 'authorized_payment', resourceId: '42', accessToken: 'test', baseUrl: 'https://api.mercadopago.com' });
    expect(fetchMock.mock.calls[0][0]).toBe('https://api.mercadopago.com/authorized_payments/42');
    expect(result.payment).toMatchObject({status: 'approved', preapproval_id: 'sub-1', invoice_id: '42'});
    expect(service.getMercadoPagoPaymentService.exec.mock.calls[0][0].paymentId).toBe('100');
  });
  it('does not treat an invoice without a payment as paid', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue(new Response(JSON.stringify({ id: 42, status: 'scheduled' }), {status: 200}));
    await expect(service.resolveMercadoPagoResource({ resourceType: 'authorized_payment', resourceId: '42', accessToken: 'test', baseUrl: 'https://api.mercadopago.com' })).rejects.toThrow('no payment yet');
  });
});
