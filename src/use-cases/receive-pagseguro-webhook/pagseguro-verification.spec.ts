import { createHash, generateKeyPairSync, sign } from 'crypto';
import { PagSeguroVerificationService } from './pagseguro-verification.service';
import { ValidatePagSeguroWebhookService } from '../../modules/payment-webhook-gateways/pagseguro/services/validate-pagseguro-webhook/validate-pagseguro-webhook.service';
import { ReceivePagSeguroWebhookDtoIn } from './dtos/receive-pagseguro-webhook.dto-in';

describe('PagBank verified notifications and reconciliation', () => {
  const fetchMock = jest.fn();
  const originalFetch = global.fetch;
  beforeEach(() => { fetchMock.mockReset(); global.fetch = fetchMock; });
  afterAll(() => { global.fetch = originalFetch; });
  function setup(environment = 'sandbox') {
    const credential = {unique_id: 'credential', provider: 'pagseguro', status: 'inactive', office_id: 'office', gateway_id: 'gateway', config: {environment}};
    const tx = {unique_id: 'payment', gateway_transaction_id: 'CHEC_ABC', external_reference: 'order', amount: 500, currency: 'BRL', config: {}, updated_at: new Date()};
    const db = {paymentWebhookEvent: {findFirst: jest.fn()}, apiCredential: {findUnique: jest.fn().mockResolvedValue(credential)}, paymentTransaction: {
      findMany: jest.fn().mockResolvedValue([tx]), findFirst: jest.fn().mockResolvedValue(tx), updateMany: jest.fn().mockResolvedValue({count: 1})}};
    const service = new PagSeguroVerificationService(db as never, {exec: () => ({apiCredential: {config: {token: 'secret'}}})} as never, new ValidatePagSeguroWebhookService());
    return {db, tx, service};
  }
  function input(extra: any = {}) { return new ReceivePagSeguroWebhookDtoIn({apiCredentialId: 'credential', payload: {id: 'ORDE_ABC', reference_id: 'order', status: 'PAID'}, rawBody: '  {"id":"ORDE_ABC"}\n', headers: {}, ...extra}); }
  function remote(status = 'PAID', value = 500) {
    fetchMock.mockResolvedValueOnce({ok: true, json: async () => ({id: 'CHEC_ABC', reference_id: 'order', orders: [{id: 'ORDE_ABC'}]})});
    fetchMock.mockResolvedValueOnce({ok: true, json: async () => ({id: 'ORDE_ABC', reference_id: 'order', charges: [{id: 'CHAR_ABC', status, amount: {value, currency: 'BRL'}}]})});
  }
  it('uses provider data for unsigned sandbox callbacks, even with inactive credentials', async () => {
    const {service, db} = setup(); remote();
    const result = await service.verifyNotification(input());
    expect(result.method).toBe('authenticated_provider_get');
    expect((result.payload.charges as any[])[0].amount.value).toBe(500);
    expect(db.paymentTransaction.findMany).toHaveBeenCalledWith(expect.objectContaining({where: expect.objectContaining({office_id: 'office', api_credential_id: 'credential', gateway_id: 'gateway'})}));
    expect(fetchMock.mock.calls.map(c => c[0])).toEqual(['https://sandbox.api.pagseguro.com/checkouts/CHEC_ABC', 'https://sandbox.api.pagseguro.com/orders/ORDE_ABC']);
  });
  it('acknowledges a duplicate using only the recent API-confirmed event', async () => {
    const {service, db, tx} = setup();
    db.paymentTransaction.findMany.mockResolvedValue([{...tx, status: 'paid'}] as any);
    const payload = {id:'ORDE_ABC', reference_id:'order', charges:[{id:'CHAR_ABC',status:'PAID'}]};
    db.paymentWebhookEvent.findFirst.mockResolvedValue({payload, metadata:{source:'PagBankApiReconciliation', apiCredentialId:'credential'}});
    expect((await service.verifyNotification(input({payload}))).payload).toEqual(payload);
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it('does not trust a forged paid payload when provider still reports waiting', async () => {
    const {service} = setup(); remote('WAITING');
    await expect(service.verifyNotification(input())).rejects.toThrow('NOT_CONFIRMED');
  });
  it('rejects settlement amount mismatch', async () => {
    const {service} = setup(); remote('PAID', 499);
    await expect(service.verifyNotification(input())).rejects.toThrow('SETTLEMENT_MISMATCH');
  });
  it('does not query the provider for another tenant or unknown payment', async () => {
    const {service, db} = setup(); db.paymentTransaction.findMany.mockResolvedValue([]);
    await expect(service.verifyNotification(input())).rejects.toThrow('RESOURCE_MISMATCH');
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it('rejects unsigned production notifications', async () => {
    const {service} = setup('production');
    await expect(service.verifyNotification(input())).rejects.toThrow('SIGNATURE_REQUIRED');
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it('never falls back to API verification after an invalid legacy signature', async () => {
    const {service} = setup();
    await expect(service.verifyNotification(input({xAuthenticityToken: '0'.repeat(64)}))).rejects.toThrow('SIGNATURE_INVALID');
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it('preserves original bytes for legacy signatures', async () => {
    const {service} = setup(); const rawBody = '  {"test":true}\n';
    const xAuthenticityToken = createHash('sha256').update('secret-' + rawBody).digest('hex');
    expect((await service.verifyNotification(input({rawBody, xAuthenticityToken}))).method).toBe('legacy_signature');
  });
  it('validates multiple ECDSA signatures and caches the public key', async () => {
    const {service} = setup(); const pair = generateKeyPairSync('ec', {namedCurve: 'prime256v1'});
    const rawBody = '  {"test":true}\n';
    const signature = sign('sha256', Buffer.from(rawBody), pair.privateKey).toString('base64');
    fetchMock.mockResolvedValue({ok: true, json: async () => ({public_key: pair.publicKey.export({type:'spki',format:'der'}).toString('base64')})});
    const request = input({rawBody, headers: {'x-payload-signature': ['invalid', signature]}});
    expect((await service.verifyNotification(request)).method).toBe('ecdsa_signature');
    await service.verifyNotification(request); expect(fetchMock).toHaveBeenCalledTimes(1);
    await expect(service.verifyNotification(input({rawBody: rawBody + 'x', headers: request.headers}))).rejects.toThrow('SIGNATURE_INVALID');
  });
  it('persists receipt and acknowledges a sandbox webhook during a scheduled retry without marking it paid', async () => {
    const {service, db, tx} = setup();
    const nextAttemptAt = Date.now() + 60000;
    db.paymentTransaction.findFirst.mockResolvedValue({...tx, status:'pending', created_at:new Date(), config:{otherSetting:true,pagbankReconciliation:{attempts:1,nextAttemptAt}}} as any);
    const result = await service.verifyNotification(input());
    expect(result).toEqual({deferred:true,transactionId:'payment',nextAttemptAt});
    expect(fetchMock).not.toHaveBeenCalled();
    const write = db.paymentTransaction.updateMany.mock.calls[0][0];
    expect(write.data.status).toBeUndefined();
    expect(write.data.config.otherSetting).toBe(true);
    expect(write.data.config.pagbankReconciliation).toMatchObject({attempts:1,nextAttemptAt,webhookReceiptStatus:'awaiting_provider_verification'});
  });
  it.each([
    {status:'pending',created_at:new Date(),attempts:96},
    {status:'pending',created_at:new Date(Date.now()-73*3600000),attempts:1},
    {status:'canceled',created_at:new Date(),attempts:1},
  ])('does not acknowledge a retry the worker cannot execute: %j', async state => {
    const {service,db,tx}=setup();
    db.paymentTransaction.findFirst.mockResolvedValue({...tx,...state,config:{pagbankReconciliation:{attempts:state.attempts,nextAttemptAt:Date.now()+60000}}} as any);
    await expect(service.verifyNotification(input())).rejects.toThrow('RETRY_LATER');
    expect(db.paymentTransaction.updateMany).not.toHaveBeenCalled();
  });
  it('does not acknowledge when persisting the receipt loses a concurrent update', async () => {
    const {service,db,tx}=setup();
    db.paymentTransaction.findFirst.mockResolvedValue({...tx,status:'pending',created_at:new Date(),config:{pagbankReconciliation:{attempts:1,nextAttemptAt:Date.now()+60000}}} as any);
    db.paymentTransaction.updateMany.mockResolvedValue({count:0});
    await expect(service.verifyNotification(input())).rejects.toThrow('RETRY_LATER');
  });
  it('limits retries across workers with persisted backoff', async () => {
    const {service, db, tx} = setup(); db.paymentTransaction.findFirst.mockResolvedValue({...tx,config:{pagbankReconciliation:{nextAttemptAt:Date.now()+60000}}} as any);
    await expect(service.reconcile('payment','credential')).rejects.toThrow('RETRY_LATER');
    expect(fetchMock).not.toHaveBeenCalled(); expect(db.paymentTransaction.updateMany).not.toHaveBeenCalled();
  });
  it('does not perform network calls when another worker owns the claim', async () => {
    const {service, db} = setup(); db.paymentTransaction.updateMany.mockResolvedValue({count:0});
    await expect(service.reconcile('payment','credential')).rejects.toThrow('BUSY'); expect(fetchMock).not.toHaveBeenCalled();
  });
  it('records backoff when the provider is unavailable', async () => {
    const {service, db} = setup(); fetchMock.mockRejectedValue(new Error('timeout'));
    await expect(service.reconcile('payment','credential')).rejects.toThrow('UNAVAILABLE');
    expect(db.paymentTransaction.updateMany).toHaveBeenCalledTimes(1);
  });
});
