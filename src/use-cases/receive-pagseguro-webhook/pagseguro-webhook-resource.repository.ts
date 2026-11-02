import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/database/prisma/prisma.service';
import { NormalizedPaymentWebhookEventDto as Event } from '../../modules/payment-webhook-events/dtos/normalized-payment-webhook-event.dto';

@Injectable()
export class PagSeguroWebhookResourceRepository {
  constructor(private readonly db: PrismaService) {}
  async bind(credentialId: string, event: Event): Promise<Event> {
    const credential = await this.db.apiCredential.findUniqueOrThrow({where:{unique_id:credentialId}});
    if (!['active','inactive'].includes(credential.status) || !credential.office_id || !credential.gateway_id)
      throw new Error('Webhook credential unavailable');
    const scope = {office_id:credential.office_id, api_credential_id:credentialId, gateway_id:credential.gateway_id};
    const remote = [event.gatewayTransactionId,event.gatewayChargeId,event.gatewayPaymentIntentId]
      .filter((v): v is string => !!v);
    const refs = [event.paymentTransactionId,event.externalReference].filter((v): v is string => !!v);
    const transactions = await this.db.paymentTransaction.findMany({where:{...scope,OR:[
      {unique_id:{in:refs}}, {external_reference:{in:refs}}, {gateway_transaction_id:{in:remote}},
    ]},take:2});
    if (transactions.length > 1) throw new Error('Ambiguous webhook payment reference');
    const tx = transactions[0];
    if (tx) {
      if ((event.paymentTransactionId && event.paymentTransactionId !== tx.unique_id) ||
          (event.checkoutSessionId && event.checkoutSessionId !== tx.checkout_session_id))
        throw new Error('Webhook resource mismatch');
      return new Event({...event,paymentTransactionId:tx.unique_id,checkoutSessionId:tx.checkout_session_id});
    }
    if (event.gatewaySubscriptionId) {
      const subscription = await this.db.subscription.findFirst({where:{...scope,gateway_subscription_id:event.gatewaySubscriptionId}});
      if (subscription && !event.paymentTransactionId && !event.checkoutSessionId &&
          (!event.subscriptionId || event.subscriptionId === subscription.unique_id))
        return new Event({...event,subscriptionId:subscription.unique_id});
    }
    throw new Error('Webhook credential does not own an existing resource');
  }
}
