import { ValidatePagSeguroWebhookDtoIn } from '../../modules/payment-webhook-gateways/pagseguro/services/validate-pagseguro-webhook/dtos/validate-pagseguro-webhook.dto-in';
import { BadRequestException, Injectable, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { createPublicKey, verify } from 'crypto';
import { PrismaService } from '../../infra/database/prisma/prisma.service';
import { DecryptApiCredentialSecretService } from '../../common/services/crypto/decrypt-api-credential-secret/decrypt-api-credential-secret.service';
import { DecryptApiCredentialSecretDtoIn } from '../../common/services/crypto/decrypt-api-credential-secret/dtos/decrypt-api-credential-secret.dto-in';
import { ValidatePagSeguroWebhookService } from '../../modules/payment-webhook-gateways/pagseguro/services/validate-pagseguro-webhook/validate-pagseguro-webhook.service';
import { ReceivePagSeguroWebhookDtoIn } from './dtos/receive-pagseguro-webhook.dto-in';

@Injectable()
export class PagSeguroVerificationService {
  private keys = new Map<string, { key: string; expires: number }>();
  constructor(private readonly db: PrismaService, private readonly decrypt: DecryptApiCredentialSecretService,
    private readonly legacy: ValidatePagSeguroWebhookService) {}

  private async credential(id: string) {
    const c = await this.db.apiCredential.findUnique({ where: { unique_id: id } });
    if (!c || !c.office_id || !c.gateway_id || !['active', 'inactive'].includes(c.status) || !['pagseguro', 'pagbank', 'pag-bank', 'pag_seguro'].includes(c.provider))
      throw new UnauthorizedException('PAGBANK_CREDENTIAL_UNAVAILABLE');
    const config = (c.config ?? {}) as Record<string, unknown>;
    if (!['sandbox', 'production'].includes(String(config.environment))) throw new BadRequestException('PAGBANK_ENVIRONMENT_INVALID');
    const decrypted = this.decrypt.exec(new DecryptApiCredentialSecretDtoIn({apiCredential: {config: {token: c.token}}, keysToDecrypt: ['token'], strict: true}));
    const token = String((decrypted.apiCredential.config as Record<string, unknown>).token ?? '');
    if (!token) throw new UnauthorizedException('PAGBANK_CREDENTIAL_UNAVAILABLE');
    return {c: {...c, office_id: c.office_id, gateway_id: c.gateway_id}, token, origin: config.environment === 'production' ? 'https://api.pagseguro.com' : 'https://sandbox.api.pagseguro.com'};
  }

  private async get(origin: string, path: string, token: string): Promise<any> {
    try {
      const r = await fetch(origin + path, {headers: {Authorization: 'Bearer ' + token, Accept: 'application/json'}, signal: AbortSignal.timeout(10000), redirect: 'error'});
      if (!r.ok) throw new Error('provider unavailable');
      return await r.json();
    } catch { throw new ServiceUnavailableException('PAGBANK_VERIFICATION_UNAVAILABLE'); }
  }

  async verifyNotification(input: ReceivePagSeguroWebhookDtoIn): Promise<
    {payload: Record<string, unknown>; method: string; deferred?: false} |
    {deferred: true; transactionId: string; nextAttemptAt: number}
  > {
    const {c, token, origin} = await this.credential(input.apiCredentialId);
    const signature = input.headers['x-payload-signature'];
    if (signature !== undefined) {
      const signatures = (Array.isArray(signature) ? signature : [signature]).flatMap(s => String(s).split(',')).map(s => s.trim()).filter(Boolean);
      if (!signatures.length) throw new UnauthorizedException('PAGBANK_SIGNATURE_INVALID');
      for (let attempt = 0; attempt < 2; attempt++) {
        let cached = this.keys.get(c.unique_id);
        if (attempt || !cached || cached.expires < Date.now()) {
          const response = await this.get(origin, '/public-keys?type=webhook', token);
          if (typeof response.public_key !== 'string') throw new ServiceUnavailableException('PAGBANK_WEBHOOK_KEY_UNAVAILABLE');
          cached = {key: response.public_key, expires: Date.now() + 3600000};
          if (this.keys.size > 1000) this.keys.clear();
          this.keys.set(c.unique_id, cached);
        }
        try {
          const key = createPublicKey({key: Buffer.from(cached.key, 'base64'), format: 'der', type: 'spki'});
          if (key.asymmetricKeyType !== 'ec') throw new Error('invalid key');
          if (signatures.some(s => /^[A-Za-z0-9+/]+={0,2}$/.test(s) && verify('sha256', Buffer.from(input.rawBody), key, Buffer.from(s, 'base64'))))
            return {payload: input.payload, method: 'ecdsa_signature'};
        } catch { this.keys.delete(c.unique_id); }
      }
      throw new UnauthorizedException('PAGBANK_SIGNATURE_INVALID');
    }
    if (input.xAuthenticityToken !== null) {
      try { this.legacy.exec(new ValidatePagSeguroWebhookDtoIn({rawBody: input.rawBody, token, xAuthenticityToken: input.xAuthenticityToken, signatureMode: 'required'})); }
      catch { throw new UnauthorizedException('PAGBANK_SIGNATURE_INVALID'); }
      return {payload: input.payload, method: 'legacy_signature'};
    }
    // Unsigned sandbox deliveries are only hints. No supplied status or amount is trusted.
    if (origin !== 'https://sandbox.api.pagseguro.com') throw new UnauthorizedException('PAGBANK_SIGNATURE_REQUIRED');
    const ref = typeof input.payload.reference_id === 'string' ? input.payload.reference_id : '';
    const id = typeof input.payload.id === 'string' ? input.payload.id : '';
    if (!ref && !id) throw new BadRequestException('PAGBANK_RESOURCE_REQUIRED');
    const rows = await this.db.paymentTransaction.findMany({where: {api_credential_id: c.unique_id, office_id: c.office_id, gateway_id: c.gateway_id,
      OR: [{external_reference: ref || '__missing__'}, {gateway_transaction_id: id || '__missing__'}]}, take: 2});
    if (rows.length !== 1) throw new UnauthorizedException('PAGBANK_RESOURCE_MISMATCH');
    // A replay may only reuse a processed API-confirmed payment with the same resource IDs.
    if (rows[0].status === 'paid') {
      const previous = await this.db.paymentWebhookEvent.findFirst({where: {
        provider: 'pagseguro', payment_transaction_id: rows[0].unique_id, status: 'processed',
      }, orderBy: {created_at: 'desc'}});
      const metadata = previous?.metadata as Record<string, unknown> | null;
      const cached = previous?.payload as Record<string, any> | null;
      const incomingCharges = input.payload.charges;
      const samePaidEvent = Array.isArray(incomingCharges) && incomingCharges.length === 1 &&
        incomingCharges[0]?.status === 'PAID' && cached?.id === id &&
        cached?.charges?.length === 1 && cached.charges[0].id === incomingCharges[0]?.id;
      if (samePaidEvent && metadata?.source === 'PagBankApiReconciliation' && metadata.apiCredentialId === c.unique_id && cached)
        return {payload: cached, method: 'authenticated_provider_get'};
    }
    try {
      return {payload: await this.reconcile(rows[0].unique_id, c.unique_id), method: 'authenticated_provider_get'};
    } catch (error) {
      // Acknowledge only an owned payment with a durable retry the worker can execute.
      if (!(error instanceof ServiceUnavailableException) || !['PAGBANK_RECONCILIATION_RETRY_LATER', 'PAGBANK_RECONCILIATION_BUSY'].includes(error.message)) throw error;
      const tx = await this.db.paymentTransaction.findFirst({where: {unique_id: rows[0].unique_id,
        api_credential_id: c.unique_id, office_id: c.office_id, gateway_id: c.gateway_id}});
      const config = (tx?.config ?? {}) as Record<string, any>;
      const state = config.pagbankReconciliation;
      if (!tx || !['pending', 'authorized'].includes(tx.status) ||
          !tx.created_at || tx.created_at.getTime() < Date.now() - 72 * 3600000 ||
          !Number.isFinite(state?.attempts) || state.attempts >= 96 ||
          !Number.isFinite(state?.nextAttemptAt) || state.nextAttemptAt <= Date.now()) throw error;
      const receipt = await this.db.paymentTransaction.updateMany({where: {unique_id: tx.unique_id, updated_at: tx.updated_at}, data: {
        config: {...config, pagbankReconciliation: {...state, webhookReceivedAt: new Date().toISOString(),
          webhookResourceId: id, webhookReceiptStatus: 'awaiting_provider_verification'}}, updated_at: new Date()}});
      if (receipt.count !== 1) throw error;
      return {deferred: true, transactionId: tx.unique_id, nextAttemptAt: state.nextAttemptAt};
    }
  }

  async reconcile(transactionId: string, credentialId: string): Promise<Record<string, unknown>> {
    const {c, token, origin} = await this.credential(credentialId);
    const tx = await this.db.paymentTransaction.findFirst({where: {unique_id: transactionId, api_credential_id: c.unique_id, office_id: c.office_id, gateway_id: c.gateway_id}});
    if (!tx) throw new UnauthorizedException('PAGBANK_RESOURCE_MISMATCH');
    const config = (tx.config ?? {}) as Record<string, any>;
    if (Number(config.pagbankReconciliation?.nextAttemptAt ?? 0) > Date.now()) throw new ServiceUnavailableException('PAGBANK_RECONCILIATION_RETRY_LATER');
    const attempts = Number(config.pagbankReconciliation?.attempts ?? 0) + 1;
    const claimed = await this.db.paymentTransaction.updateMany({where: {unique_id: tx.unique_id, updated_at: tx.updated_at}, data: {
      config: {...config, pagbankReconciliation: {attempts, nextAttemptAt: Date.now() + Math.min(1800000, 30000 * 2 ** Math.min(attempts, 6))}}, updated_at: new Date()}});
    if (claimed.count !== 1) throw new ServiceUnavailableException('PAGBANK_RECONCILIATION_BUSY');
    const remote = String(tx.gateway_transaction_id ?? '');
    let orderIds: string[];
    if (/^CHEC_[A-Z0-9-]+$/i.test(remote)) {
      const checkout = await this.get(origin, '/checkouts/' + remote, token);
      if (checkout.id !== remote || checkout.reference_id !== tx.external_reference) throw new UnauthorizedException('PAGBANK_RESOURCE_MISMATCH');
      orderIds = (checkout.orders ?? []).map((o: any) => o.id);
    } else if (/^ORDE_[A-Z0-9-]+$/i.test(remote)) orderIds = [remote];
    else throw new BadRequestException('PAGBANK_RESOURCE_UNSUPPORTED');
    if (orderIds.length > 10) throw new BadRequestException('PAGBANK_AMBIGUOUS_ORDERS');
    const paid: any[] = [];
    for (const id of orderIds) {
      if (!/^ORDE_[A-Z0-9-]+$/i.test(id)) throw new BadRequestException('PAGBANK_RESOURCE_INVALID');
      const order = await this.get(origin, '/orders/' + id, token);
      if (order.id !== id || order.reference_id !== tx.external_reference) throw new UnauthorizedException('PAGBANK_RESOURCE_MISMATCH');
      for (const charge of order.charges ?? []) {
        if (charge.status !== 'PAID') continue;
        if (charge.amount?.value !== Number(tx.amount) || charge.amount?.currency !== tx.currency || Number(charge.amount?.summary?.refunded ?? 0) > 0)
          throw new UnauthorizedException('PAGBANK_SETTLEMENT_MISMATCH');
        paid.push({...order, charges: [charge]});
      }
    }
    if (paid.length > 1) throw new BadRequestException('PAGBANK_AMBIGUOUS_PAYMENT');
    if (!paid.length) throw new ServiceUnavailableException('PAGBANK_PAYMENT_NOT_CONFIRMED');
    return paid[0];
  }
}
