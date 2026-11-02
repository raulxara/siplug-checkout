import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { NormalizedPaymentWebhookEventDto } from '../../payment-webhook-events/dtos/normalized-payment-webhook-event.dto';
import { billingPeriodEnd } from '../services/billing-period.service';
@Injectable()
export class SubscriptionRenewalsRepository {
  constructor(private readonly db: PrismaService) {}
  async ensure(
    eventId: string,
    event: NormalizedPaymentWebhookEventDto,
  ): Promise<string | null> {
    if (
      !['paid', 'invoice_paid', 'failed', 'invoice_payment_failed'].includes(
        event.canonicalStatus,
      )
    )
      return null;
    const invoiceKey =
      event.provider === 'mercado_pago' && event.gatewayTransactionId
        ? 'payment:' + event.gatewayTransactionId
        : event.gatewayInvoiceId;
    if (!invoiceKey) return null;
    const webhook = await this.db.paymentWebhookEvent.findUnique({
      where: { unique_id: eventId },
    });
    const credentialId = (webhook?.metadata as Record<string, unknown> | null)
      ?.apiCredentialId;
    if (typeof credentialId !== 'string') return null;
    const credential = await this.db.apiCredential.findUnique({
      where: { unique_id: credentialId },
    });
    if (!credential?.office_id) return null;
    const officeId = credential.office_id;
    return this.db.$transaction(async (tx) => {
      const references: Record<string, string>[] = [];
      if (event.gatewaySubscriptionId)
        references.push({
          gateway_subscription_id: event.gatewaySubscriptionId,
        });
      if (event.subscriptionId)
        references.push({ unique_id: event.subscriptionId });
      if (!references.length) return null;
      const sub = await tx.subscription.findFirst({
        where: {
          office_id: officeId,
          api_credential_id: credentialId,
          OR: references,
        },
        include: { subscription_plan: true },
      });
      if (
        !sub?.subscription_plan ||
        !['month', 'year'].includes(sub.subscription_plan.interval_type)
      )
        return null;
      await tx.$queryRaw`SELECT id FROM subscriptions WHERE id = ${sub.id} FOR UPDATE`;
      const existing = await tx.subscriptionInvoice.findFirst({
        where: {
          subscription_id: sub.unique_id,
          gateway_invoice_id: invoiceKey,
        },
      });
      if (existing) {
        if (event.amount !== existing.amount || event.currency?.toUpperCase() !== existing.currency.toUpperCase()) throw new Error('Subscription invoice amount or currency mismatch');
        return existing.unique_id;
      }
      if (
        event.amount !== sub.amount ||
        event.currency?.toUpperCase() !== sub.currency.toUpperCase()
      )
        throw new Error('Subscription invoice amount or currency mismatch');

      const first = await tx.subscriptionInvoice.findFirst({
        where: { subscription_id: sub.unique_id },
        orderBy: { id: 'asc' },
      });
      // Attach the first provider invoice to the initial cycle once. Each later invoice owns a new cycle.
      if (first && !first.gateway_invoice_id) {
        await tx.subscriptionInvoice.update({
          where: { id: first.id },
          data: { gateway_invoice_id: invoiceKey },
        });
        if (first.subscription_cycle_id) {
          const cycle = await tx.subscriptionCycle.findUnique({
            where: { unique_id: first.subscription_cycle_id },
          });
          if (cycle && !cycle.period_end) {
            const start = cycle.period_start ?? new Date();
            await tx.subscriptionCycle.update({
              where: { id: cycle.id },
              data: {
                period_start: start,
                period_end: billingPeriodEnd(
                  start,
                  sub.subscription_plan.interval_type,
                  sub.subscription_plan.interval_count,
                ),
              },
            });
          }
        }
        return first.unique_id;
      }
      const latest = await tx.subscriptionCycle.findFirst({
        where: { subscription_id: sub.unique_id },
        orderBy: { cycle_number: 'desc' },
      });
      const start = latest?.period_end ?? new Date();
      const end = billingPeriodEnd(
        start,
        sub.subscription_plan.interval_type,
        sub.subscription_plan.interval_count,
      );
      const cycle = await tx.subscriptionCycle.create({
        data: {
          unique_id: randomUUID(),
          subscription_id: sub.unique_id,
          cycle_number: (latest?.cycle_number ?? 0) + 1,
          amount: sub.amount,
          currency: sub.currency,
          period_start: start,
          period_end: end,
          status: 'scheduled',
        },
      });
      const invoice = await tx.subscriptionInvoice.create({
        data: {
          unique_id: randomUUID(),
          subscription_id: sub.unique_id,
          subscription_cycle_id: cycle.unique_id,
          gateway_invoice_id: invoiceKey,
          amount: sub.amount,
          currency: sub.currency,
          status: 'created',
        },
      });
      return invoice.unique_id;
    });
  }
}
