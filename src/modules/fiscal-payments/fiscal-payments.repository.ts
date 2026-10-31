import type { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/database/prisma/prisma.service';
interface ConfirmedFiscalPayment {
  paymentId: string;
  sessionId: string | null;
  orderRef: string | null;
  subscriptionInvoiceId: string | null;
  paidAt: Date | null;
  amount: number;
  currency: string;
  customer: {
    name: string;
    email: string | null;
    documentType: string | null;
    document: string | null;
    phone: string | null;
    address: Prisma.JsonValue;
  } | null;
  items: {
    productId: string | null;
    name: string;
    quantity: number;
    unitAmount: number;
    totalAmount: number;
  }[];
}
@Injectable()
export class FiscalPaymentsRepository {
  constructor(private readonly db: PrismaService) {}
  async list(officeId: string, clientId: string, since: Date, page: number) {
    const scope = { office_id: officeId, client_id: clientId };
    const paid = {
      paid_at: { gte: since },
      status: { in: ['paid', 'approved', 'completed'] },
    };
    const rows = await this.db.paymentTransaction.findMany({
      where: { ...scope, ...paid },
      orderBy: { id: 'asc' },
      skip: (page - 1) * 100,
      take: 100,
      include: {
        checkout_session: { include: { items: true } },
        payment_customer: true,
        subscription_invoices: { include: { subscription: true } },
      },
    });
    const result: ConfirmedFiscalPayment[] = [];
    for (const t of rows) {
      let session = t.checkout_session;
      const inv = t.subscription_invoices.find(
        (i) =>
          i.subscription.office_id === officeId &&
          i.subscription.client_id === clientId,
      );
      // A recurring payment uses the invoice identity even if linkage arrives later.
      if (['recurring', 'split_recurring'].includes(t.payment_type) && !inv)
        continue;
      if (!session && inv?.subscription.external_reference)
        session = await this.db.checkoutSession.findFirst({
          where: {
            ...scope,
            external_reference: inv.subscription.external_reference,
          },
          include: { items: true },
        });
      const c = t.payment_customer;
      const validSession =
        session?.office_id === officeId && session.client_id === clientId
          ? session
          : null;
      const validCustomer =
        c?.office_id === officeId && c.client_id === clientId ? c : null;
      result.push({
        paymentId: inv ? 'invoice:' + inv.unique_id : t.unique_id,
        sessionId: validSession?.unique_id ?? null,
        orderRef: validSession?.external_reference ?? null,
        subscriptionInvoiceId: inv?.unique_id ?? null,
        paidAt: t.paid_at,
        amount: t.amount,
        currency: t.currency,
        customer: validCustomer
          ? {
              name: validCustomer.name,
              email: validCustomer.email,
              documentType: validCustomer.document_type,
              document: validCustomer.document_value,
              phone: validCustomer.phone,
              address: validCustomer.billing_address,
            }
          : null,
        items:
          validSession?.items
            .filter((i) => i.status === 'active')
            .map((i) => ({
              productId: i.item_ref,
              name: i.name,
              quantity: i.quantity,
              unitAmount: i.unit_amount,
              totalAmount: i.total_amount,
            })) ?? [],
      });
    }
    return { items: result, hasMore: rows.length === 100 };
  }
  async invoices(
    officeId: string,
    clientId: string,
    since: Date,
    page: number,
  ) {
    const scope = { office_id: officeId, client_id: clientId };
    const rows = await this.db.subscriptionInvoice.findMany({
      where: {
        payment_transaction_id: null,
        paid_at: { gte: since },
        status: 'paid',
        subscription: scope,
      },
      orderBy: { id: 'asc' },
      skip: (page - 1) * 100,
      take: 100,
      include: { subscription: { include: { payment_customer: true } } },
    });
    const items: ConfirmedFiscalPayment[] = [];
    for (const i of rows) {
      const sub = i.subscription;
      const c = sub.payment_customer;
      const session = sub.external_reference
        ? await this.db.checkoutSession.findFirst({
            where: { ...scope, external_reference: sub.external_reference },
            include: { items: true },
          })
        : null;
      items.push({
        paymentId: 'invoice:' + i.unique_id,
        sessionId: session?.unique_id ?? null,
        orderRef: session?.external_reference ?? null,
        subscriptionInvoiceId: i.unique_id,
        paidAt: i.paid_at,
        amount: i.amount,
        currency: i.currency,
        customer:
          c.office_id === officeId && c.client_id === clientId
            ? {
                name: c.name,
                email: c.email,
                documentType: c.document_type,
                document: c.document_value,
                phone: c.phone,
                address: c.billing_address,
              }
            : null,
        items:
          session?.items
            .filter((x) => x.status === 'active')
            .map((x) => ({
              productId: x.item_ref,
              name: x.name,
              quantity: x.quantity,
              unitAmount: x.unit_amount,
              totalAmount: x.total_amount,
            })) ?? [],
      });
    }
    return { items, hasMore: rows.length === 100 };
  }
}
