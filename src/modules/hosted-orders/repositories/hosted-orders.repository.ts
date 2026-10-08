import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { CheckoutGeneralSettingsService } from '../../checkout-settings/services/checkout-general-settings.service';
import type { HostedOrderResult } from '../entities/hosted-order.entity';
@Injectable()
export class HostedOrdersRepository {
  constructor(private readonly db: PrismaService) {}
  async reserve(
    officeId: string,
    clientId: string,
    orderId: string,
    hash: string,
  ) {
    const key = {
      office_id: officeId,
      client_id: clientId,
      idempotency_key: 'hosted:' + orderId,
    };
    await this.db.paymentIdempotencyKey.upsert({
      where: { office_id_client_id_idempotency_key: key },
      create: {
        ...key,
        unique_id: randomUUID(),
        request_hash: hash,
        resource_type: 'hosted_order',
        status: 'ready',
      },
      update: {},
    });
    const row = await this.db.paymentIdempotencyKey.findUniqueOrThrow({
      where: { office_id_client_id_idempotency_key: key },
    });
    if (row.request_hash !== hash)
      throw new ConflictException('Pedido já iniciado com outros dados.');
    const result = await this.db.paymentIdempotencyKey.updateMany({
      where: {
        id: row.id,
        OR: [
          { status: 'ready' },
          {
            status: 'processing',
            updated_at: { lt: new Date(Date.now() - 300000) },
          },
        ],
      },
      data: { status: 'processing' },
    });
    if (!result.count)
      throw new ConflictException(
        'Pedido em processamento. Consulte o resultado.',
      );
    return row.id;
  }
  async release(id: number) {
    await this.db.paymentIdempotencyKey.update({
      where: { id },
      data: { status: 'ready' },
    });
  }
  async gateway(officeId: string, clientId: string, mode: string) {
    const office = await this.db.office.findUniqueOrThrow({
      where: { unique_id: officeId },
    });
    const settings = CheckoutGeneralSettingsService.read(office.config);
    if (!settings.configured)
      throw new BadRequestException('Configure o checkout antes de vender.');
    const rows = await this.db.apiCredential.findMany({
      where: {
        office_id: officeId,
        status: 'active',
        OR: [{ client_id: clientId }, { client_id: null }],
        gateway: { status: 'active' },
      },
    });
    const flag =
      mode === 'recurring'
        ? 'supportsRecurringPayment'
        : 'supportsOneTimePayment';
    const available = rows.filter((r) => {
      const c = (r.config ?? {}) as Record<string, unknown>;
      return (
        c[flag] === true &&
        (c.environment ?? r.environment) === settings.environment &&
        Array.isArray(c.paymentMethods) &&
        c.paymentMethods.includes('payment_link')
      );
    });
    const defaults = available.filter((r) => {
      const c = r.config as Record<string, unknown>;
      return Array.isArray(c.defaultModes) && c.defaultModes.includes(mode);
    });
    const selected =
      defaults.length === 1
        ? defaults[0]
        : available.length === 1
          ? available[0]
          : null;
    if (!selected?.gateway_id)
      throw new BadRequestException(
        'Defina um gateway padrão habilitado para esta modalidade.',
      );
    return selected;
  }
  async plan(officeId: string, slug: string) {
    return this.db.subscriptionPlan.findUnique({
      where: { office_id_slug: { office_id: officeId, slug } },
    });
  }
  async session(officeId: string, clientId: string, orderId: string) {
    return this.db.checkoutSession.findFirst({
      where: {
        office_id: officeId,
        client_id: clientId,
        external_reference: orderId,
      },
      include: { items: true },
    });
  }
  async result(
    officeId: string,
    clientId: string,
    orderId: string,
  ): Promise<HostedOrderResult> {
    const session = await this.session(officeId, clientId, orderId);
    if (!session) throw new NotFoundException();
    const tx = await this.db.paymentTransaction.findFirst({
      where: {
        office_id: officeId,
        client_id: clientId,
        checkout_session_id: session.unique_id,
      },
      orderBy: { id: 'desc' },
    });
    const sub = await this.db.subscription.findFirst({
      where: {
        office_id: officeId,
        client_id: clientId,
        external_reference: orderId,
      },
    });
    let cycle = sub
      ? await this.db.subscriptionCycle.findFirst({
          where: { subscription_id: sub.unique_id, status: 'paid' },
          orderBy: { cycle_number: 'desc' },
        })
      : null;
    if (sub && !cycle)
      cycle = await this.db.subscriptionCycle.findFirst({
        where: { subscription_id: sub.unique_id },
        orderBy: { cycle_number: 'asc' },
      });
    const invoice = sub
      ? await this.db.subscriptionInvoice.findFirst({
          where: { subscription_id: sub.unique_id, status: 'paid' },
          orderBy: { id: 'desc' },
        })
      : null;
    return {
      checkoutSessionId: session.unique_id,
      transactionId: tx?.unique_id ?? null,
      subscriptionId: sub?.unique_id ?? null,
      status: ['refunded', 'chargeback'].includes(tx?.status ?? '')
        ? tx!.status
        : invoice
          ? 'paid'
          : (tx?.status ?? 'pending'),
      amount: session.amount,
      currency: session.currency,
      checkoutUrl: tx?.checkout_url ?? null,
      paidAt:
        invoice?.paid_at?.toISOString() ?? tx?.paid_at?.toISOString() ?? null,
      validUntil: cycle?.period_end?.toISOString() ?? null,
      subscriptionStatus: sub?.status ?? null,
      renewalId: cycle?.unique_id ?? null,
    };
  }
}
