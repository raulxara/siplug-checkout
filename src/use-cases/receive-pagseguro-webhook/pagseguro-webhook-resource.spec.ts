import { PagSeguroWebhookResourceRepository } from './pagseguro-webhook-resource.repository';
import { NormalizedPaymentWebhookEventDto as Event } from '../../modules/payment-webhook-events/dtos/normalized-payment-webhook-event.dto';
import { ValidatePagSeguroWebhookService } from '../../modules/payment-webhook-gateways/pagseguro/services/validate-pagseguro-webhook/validate-pagseguro-webhook.service';
import { ReceivePagSeguroWebhookUseCase } from './receive-pagseguro-webhook.use-case';

describe('PagBank historical payment callbacks',()=>{
  const credential={unique_id:'credential',office_id:'office',gateway_id:'gateway',status:'inactive'};
  const tx={unique_id:'payment',checkout_session_id:'session'};
  function setup(rows:unknown[]=[tx]) {
    const db={apiCredential:{findUniqueOrThrow:jest.fn().mockResolvedValue(credential)},paymentTransaction:{findMany:jest.fn().mockResolvedValue(rows)},subscription:{findFirst:jest.fn().mockResolvedValue(null)}};
    return {db,repo:new PagSeguroWebhookResourceRepository(db as never)};
  }
  it('binds a delayed callback to an existing payment despite inactive credential',async()=>{
    const {db,repo}=setup();
    const result=await repo.bind('credential',new Event({provider: "pagseguro", eventId: "event", canonicalStatus: "paid", externalReference:'order',gatewayChargeId:'charge'}));
    expect(result.paymentTransactionId).toBe('payment');
    expect(result.checkoutSessionId).toBe('session');
    expect(db.paymentTransaction.findMany).toHaveBeenCalledWith(expect.objectContaining({where:expect.objectContaining({office_id:'office',api_credential_id:'credential',gateway_id:'gateway'})}));
  });
  it('rejects an unowned or unknown reference without registering a payment',async()=>{
    const {repo}=setup([]);
    await expect(repo.bind('credential',new Event({provider: "pagseguro", eventId: "event", canonicalStatus: "paid", externalReference:'another-office-order'}))).rejects.toThrow('does not own');
  });
  it('rejects conflicting internal references',async()=>{
    const {repo}=setup();
    await expect(repo.bind('credential',new Event({provider: "pagseguro", eventId: "event", canonicalStatus: "paid", paymentTransactionId:'another-payment'}))).rejects.toThrow('mismatch');
  });
  it('rejects ambiguous references',async()=>{
    const {repo}=setup([tx,tx]);
    await expect(repo.bind('credential',new Event({provider: "pagseguro", eventId: "event", canonicalStatus: "paid", externalReference:'order'}))).rejects.toThrow('Ambiguous');
  });
  it('does not revive deleted credentials',async()=>{
    const {repo,db}=setup();db.apiCredential.findUniqueOrThrow.mockResolvedValue({...credential,status:'delect'});
    await expect(repo.bind('credential',new Event({provider: "pagseguro", eventId: "event", canonicalStatus: "paid", externalReference:'order'}))).rejects.toThrow('unavailable');
  });
  it('requires a signature for inactive legacy credentials configured as optional',async()=>{
    const usecase=Object.create(ReceivePagSeguroWebhookUseCase.prototype);
    usecase.findApiCredentialByUniqueIdService={exec:async()=>({apiCredential:{provider:'pagseguro',status:'inactive',token:'secret',config:{webhookSignatureMode:'optional'}}})};
    usecase.decryptApiCredentialSecretService={exec:()=>({apiCredential:{config:{token:'secret'}}})};
    const data=await usecase.resolveCredentialData('credential');
    expect(data.signatureMode).toBe('required');
    const validator=new ValidatePagSeguroWebhookService();
    expect(()=>validator.exec({token:data.token,signatureMode:data.signatureMode,rawBody:'{}',xAuthenticityToken:null})).toThrow('required');
    expect(()=>validator.exec({token:data.token,signatureMode:data.signatureMode,rawBody:'{}',xAuthenticityToken:'0'.repeat(64)})).toThrow('invalid');
  });
});
