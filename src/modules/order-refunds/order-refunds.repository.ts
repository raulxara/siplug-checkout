import { RefundPaymentContext } from './mercado-pago-refund.service';
import { supportsOrderRefund } from './refund-provider';
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../infra/database/prisma/prisma.service';
import { MixedBillingService } from '../hosted-orders/services/mixed-billing.service';
import { OrderRefundDto } from './order-refunds.dto';
@Injectable()
export class OrderRefundsRepository {
  constructor(readonly db: PrismaService) {}
  scope(office: string, client: string, order: string) {
    const refs = [order, MixedBillingService.childId(order)];
    return {
      office_id: office,
      client_id: client,
      OR: [
        {
          checkout_session: {
            office_id: office,
            client_id: client,
            external_reference: { in: refs },
          },
        },
        {
          subscription_invoices: {
            some: {
              subscription: {
                office_id: office,
                client_id: client,
                external_reference: { in: refs },
              },
            },
          },
        },
      ],
    };
  }
  async payments(office: string, client: string, order: string) {
    return this.db.paymentTransaction.findMany({
      where: this.scope(office, client, order),
      include: { refunds: true, api_credential: true },
      orderBy: { id: 'desc' },
      take: 100,
    });
  }
  async payment(office: string, client: string, d: OrderRefundDto) {
    const p = await this.db.paymentTransaction.findFirst({
      where: {
        ...this.scope(office, client, d.orderId),
        unique_id: d.paymentId,
      },
      include: { api_credential: true },
    });
    if (!p) throw new NotFoundException();
    const c = p.api_credential;
    if (
      !c ||
      c.office_id !== office ||
      (c.client_id && c.client_id !== client) ||
      c.status !== 'active' ||
      !c.token ||
      !supportsOrderRefund(c.provider)
    )
      throw new BadRequestException('REFUND_PROVIDER_UNAVAILABLE');
    // Split refunds must pass through the split ledger; never silently bypass it.
    if (p.has_split || p.split_required)
      throw new BadRequestException('REFUND_SPLIT_REVIEW');
    return p;
  }
  async pinPaymentContext(
    office: string,
    client: string,
    paymentId: string,
    credentialId: string,
    context: RefundPaymentContext,
  ) {
    await this.db.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM payment_transactions WHERE _id = ${paymentId} AND office_id = ${office} AND client_id = ${client} FOR UPDATE`;
      const payment = await tx.paymentTransaction.findFirst({
        where: {
          unique_id: paymentId,
          office_id: office,
          client_id: client,
          api_credential_id: credentialId,
        },
      });
      if (!payment) throw new ConflictException('REFUND_CONTEXT_MISMATCH');
      const config = (payment.config ?? {}) as Record<string, unknown>;
      const old = config.refundPaymentContext as
        | (RefundPaymentContext & { credentialId: string })
        | undefined;
      if (
        old &&
        (old.credentialId !== credentialId ||
          old.paymentId !== context.paymentId ||
          old.liveMode !== context.liveMode ||
          old.collectorId !== context.collectorId ||
          (old.applicationId && old.applicationId !== context.applicationId))
      )
        throw new ConflictException('REFUND_CONTEXT_MISMATCH');
      await tx.paymentTransaction.update({
        where: { unique_id: paymentId },
        data: {
          config: {
            ...config,
            refundPaymentContext: { ...context, credentialId },
          } as never,
        },
      });
    });
  }
  async projectConfirmed(office: string, client: string, paymentId: string) {
    await this.db.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM payment_transactions WHERE _id = ${paymentId} AND office_id = ${office} AND client_id = ${client} FOR UPDATE`;
      const p = await tx.paymentTransaction.findFirst({
        where: { unique_id: paymentId, office_id: office, client_id: client },
      });
      if (!p) return;
      const refunds = await tx.paymentRefund.findMany({
        where: {
          office_id: office,
          client_id: client,
          payment_transaction_id: paymentId,
          status: 'succeeded',
        },
      });
      const total = Math.max(
        refunds.reduce((n, r) => n + r.amount, 0),
        ...refunds.map(
          (r) =>
            Number(
              (r.metadata as Record<string, unknown> | null)
                ?.providerRefundedBefore ?? 0,
            ) + r.amount,
        ),
      );
      if (total >= p.amount && p.status !== 'chargeback') {
        await tx.paymentTransaction.update({
          where: { unique_id: paymentId },
          data: {
            status: 'refunded',
            refunded_at: p.refunded_at ?? new Date(),
          },
        });
        await tx.subscriptionInvoice.updateMany({
          where: {
            payment_transaction_id: paymentId,
            subscription: { office_id: office, client_id: client },
            status: 'paid',
          },
          data: { status: 'refunded' },
        });
      }
    });
  }
  findRefund(id: string) {
    return this.db.paymentRefund.findUnique({ where: { unique_id: id } });
  }
  requireRefund(id: string) {
    return this.db.paymentRefund.findUniqueOrThrow({
      where: { unique_id: id },
    });
  }
  claimRefund(id: string) {
    return this.db.paymentRefund.updateMany({
      where: { unique_id: id, status: 'created' },
      data: { status: 'submitted' },
    });
  }
  async saveRefundResult(
    id: string,
    state: string,
    gatewayId?: string,
    failure?: {
      code: string;
      upstreamStatus: number | null;
      providerCode: string | null;
      providerRequestId?: string | null;
      at: string;
    },
  ) {
    const current = failure || gatewayId ? await this.requireRefund(id) : null;
    const metadata = current
      ? { ...((current.metadata as Record<string, unknown>) ?? {}) }
      : null;
    if (metadata) {
      if (failure) metadata.lastFailure = failure;
      else delete metadata.lastFailure;
    }

    await this.db.paymentRefund.updateMany({
      where: {
        unique_id: id,
        status:
          state === 'created' ? 'created' : { notIn: ['succeeded', 'failed'] },
      },
      data: {
        status: state,
        ...(gatewayId ? { gateway_refund_id: gatewayId } : {}),
        ...(metadata ? { metadata: metadata as never } : {}),
      },
    });
    return this.requireRefund(id);
  }
  subscriptions(office: string, client: string, order: string) {
    return this.db.subscription.findMany({
      where: {
        office_id: office,
        client_id: client,
        external_reference: { in: [order, MixedBillingService.childId(order)] },
      },
      include: { api_credential: true },
      take: 100,
    });
  }
  subscription(office: string, client: string, order: string, id: string) {
    return this.db.subscription.findFirst({
      where: {
        unique_id: id,
        office_id: office,
        client_id: client,
        external_reference: { in: [order, MixedBillingService.childId(order)] },
      },
      include: { api_credential: true },
    });
  }
  async completeSubscription(
    office: string,
    client: string,
    id: string,
    immediate: boolean,
  ) {
    const where = { unique_id: id, office_id: office, client_id: client };
    await this.db.$transaction(async (tx) => {
      await tx.subscription.updateMany({
        where,
        data: { status: 'canceled', next_billing_at: null },
      });
      await tx.subscription.updateMany({
        where: { ...where, canceled_at: null },
        data: { canceled_at: new Date() },
      });
      if (immediate)
        await tx.subscription.updateMany({
          where: { ...where, ended_at: null },
          data: { ended_at: new Date() },
        });
    });
  }
  async attachRefund(
    office: string,
    client: string,
    d: OrderRefundDto,
    gatewayId: string,
    state: string,
  ) {
    await this.db.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM payment_transactions WHERE _id = ${d.paymentId} AND office_id = ${office} AND client_id = ${client} FOR UPDATE`;
      const duplicate = await tx.paymentRefund.findFirst({
        where: {
          payment_transaction_id: d.paymentId,
          gateway_refund_id: gatewayId,
          unique_id: { not: d.requestId },
        },
      });
      if (duplicate) throw new ConflictException('REFUND_ALREADY_LINKED');
      await tx.paymentRefund.updateMany({
        where: {
          unique_id: d.requestId,
          office_id: office,
          client_id: client,
          status: { notIn: ['succeeded', 'failed'] },
        },
        data: { gateway_refund_id: gatewayId, status: state },
      });
    });
  }
  async reserve(
    office: string,
    client: string,
    d: OrderRefundDto,
    externalRefunded: number,
    gatewayPaymentId?: string,
  ) {
    return this.db.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM payment_transactions WHERE _id = ${d.paymentId} AND office_id = ${office} AND client_id = ${client} FOR UPDATE`;
      const old = await tx.paymentRefund.findUnique({
        where: { unique_id: d.requestId },
      });
      if (old) {
        if (
          old.office_id !== office ||
          old.client_id !== client ||
          old.payment_transaction_id !== d.paymentId ||
          old.amount !== d.amount
        )
          throw new ConflictException('REFUND_KEY_REUSED');
        return old;
      }
      const p = await tx.paymentTransaction.findFirst({
        where: { unique_id: d.paymentId, office_id: office, client_id: client },
      });
      if (
        !p ||
        !['paid', 'approved', 'completed', 'partially_refunded'].includes(
          p.status,
        )
      )
        throw new ConflictException('REFUND_PAYMENT_STATE');
      const rows = await tx.paymentRefund.findMany({
        where: {
          payment_transaction_id: d.paymentId,
          status: { notIn: ['failed', 'rejected', 'canceled'] },
        },
      });
      if (rows.some((r) => r.status !== 'succeeded'))
        throw new ConflictException('REFUND_IN_PROGRESS');
      const used = Math.max(
        externalRefunded,
        rows.reduce((n, r) => n + r.amount, 0),
      );
      if (d.amount > p.amount - used)
        throw new ConflictException('REFUND_AMOUNT_EXCEEDED');
      return tx.paymentRefund.create({
        data: {
          unique_id: d.requestId,
          office_id: office,
          client_id: client,
          payment_transaction_id: d.paymentId,
          amount: d.amount,
          currency: p.currency,
          status: 'created',
          metadata: {
            orderId: d.orderId,
            providerRefundedBefore: externalRefunded,
            ...(gatewayPaymentId ? { gatewayPaymentId } : {}),
          },
        },
      });
    });
  }
}
