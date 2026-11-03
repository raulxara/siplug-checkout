import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../infra/database/prisma/prisma.service';
import { BillingListDto } from './billing.dto';
import {
  financialStatus,
  manualActions,
  paymentLink,
  dueStatus,
  billingDayStart,
} from './billing.entity';
export const obj = (v: unknown): Record<string, any> =>
  v && typeof v === 'object' && !Array.isArray(v)
    ? (v as Record<string, any>)
    : {};
// Aliases below are internal constants, never request input.
function stateSql(source: 's' | 'i' | 'p', payment: 'sp' | 'ip' | 'p') {
  const state = `COALESCE(${payment}.status,${source}.status)`;
  const paid =
    source === 'i'
      ? `COALESCE(${payment}.paid_at,i.paid_at)`
      : `${payment}.paid_at`;
  const received =
    source === 's'
      ? "COALESCE(JSON_EXTRACT(s.config,'$.billing.received'),0)"
      : '0';
  const refunds = `COALESCE((SELECT SUM(r.amount) FROM payment_refunds r WHERE r.payment_transaction_id=${payment}._id AND r.status IN ('approved','completed','succeeded','refunded')),0)`;
  return Prisma.raw(`CASE WHEN ${refunds}>0 THEN IF(${refunds}>=${source}.amount,'refunded','partial_refund')
 WHEN ${state} IN ('refunded','partially_refunded') THEN IF(${state}='refunded','refunded','partial_refund')
 WHEN ${paid} IS NOT NULL OR ${state} IN ('paid','approved','completed','succeeded') THEN 'paid'
 WHEN ${state} IN ('canceled','cancelled','void') THEN 'canceled'
 WHEN ${received}>0 AND ${received}>=${source}.amount THEN 'paid'
 WHEN ${received}>0 THEN 'partial'
 WHEN ${state} IN ('failed','rejected','declined') THEN 'failed'
 WHEN ${state}='draft' THEN 'draft' ELSE 'open' END`);
}
@Injectable()
export class BillingRepository {
  constructor(readonly db: PrismaService) {}
  async list(office: string, client: string, d: BillingListDto) {
    // One row per session (not per attempt), per recurring cycle, or standalone payment.
    const raw = Prisma.sql`
 SELECT s._id id,'session' kind,s.created_at createdAt,s.amount,s.currency,COALESCE((SELECT g.name FROM gateways g WHERE g._id=s.gateway_id),'') gateway,
 COALESCE(STR_TO_DATE(REPLACE(LEFT(JSON_UNQUOTE(JSON_EXTRACT(s.config,'$.billing.dueAt')),19),'T',' '),'%Y-%m-%d %H:%i:%s'),s.expires_at) dueAt,
 CASE WHEN JSON_EXTRACT(s.config,'$.billing.version') IS NOT NULL THEN 'manual' ELSE 'one_time' END origin,
 COALESCE(NULLIF(TRIM(c.name),''),NULLIF(NULLIF(TRIM(JSON_UNQUOTE(JSON_EXTRACT(sp.provider_payload,'$.customer.name'))),'null'),''),NULLIF(NULLIF(TRIM(JSON_UNQUOTE(JSON_EXTRACT(sp.provider_payload,'$.payer.name'))),'null'),''),'') customer,COALESCE(NULLIF(TRIM(c.email),''),NULLIF(NULLIF(TRIM(JSON_UNQUOTE(JSON_EXTRACT(sp.provider_payload,'$.customer.email'))),'null'),''),NULLIF(NULLIF(TRIM(JSON_UNQUOTE(JSON_EXTRACT(sp.provider_payload,'$.payer.email'))),'null'),''),NULLIF(NULLIF(TRIM(JSON_UNQUOTE(JSON_EXTRACT(sp.provider_payload,'$.payer_email'))),'null'),''),NULLIF(NULLIF(TRIM(JSON_UNQUOTE(JSON_EXTRACT(sp.provider_payload,'$.customer_email'))),'null'),''),'') email,COALESCE(s.external_reference,'') reference,
 ${stateSql('s', 'sp')} state
 FROM checkout_sessions s LEFT JOIN payment_transactions sp ON sp._id=(SELECT chosen._id FROM payment_transactions chosen WHERE chosen.checkout_session_id=s._id AND chosen.office_id=s.office_id AND chosen.client_id=s.client_id ORDER BY (chosen.paid_at IS NOT NULL) DESC,chosen.id DESC LIMIT 1) LEFT JOIN payment_customers c ON c._id=COALESCE(sp.payment_customer_id,s.payment_customer_id) AND c.office_id=s.office_id AND c.client_id=s.client_id
 WHERE s.office_id=${office} AND s.client_id=${client} AND s.payment_type='one_time' AND NOT EXISTS(SELECT 1 FROM subscription_invoices linked WHERE linked.payment_transaction_id=sp._id) AND (JSON_EXTRACT(s.config,'$.billing.version') IS NOT NULL OR EXISTS(SELECT 1 FROM payment_transactions attempt WHERE attempt.checkout_session_id=s._id))
 UNION ALL
 SELECT i._id,'invoice',i.created_at,i.amount,i.currency,COALESCE((SELECT g.name FROM gateways g WHERE g._id=s.gateway_id),''),i.due_at,'recurring',COALESCE(NULLIF(TRIM(c.name),''),NULLIF(NULLIF(TRIM(JSON_UNQUOTE(JSON_EXTRACT(ip.provider_payload,'$.customer.name'))),'null'),''),NULLIF(NULLIF(TRIM(JSON_UNQUOTE(JSON_EXTRACT(ip.provider_payload,'$.payer.name'))),'null'),''),''),COALESCE(NULLIF(TRIM(c.email),''),NULLIF(NULLIF(TRIM(JSON_UNQUOTE(JSON_EXTRACT(ip.provider_payload,'$.customer.email'))),'null'),''),NULLIF(NULLIF(TRIM(JSON_UNQUOTE(JSON_EXTRACT(ip.provider_payload,'$.payer.email'))),'null'),''),NULLIF(NULLIF(TRIM(JSON_UNQUOTE(JSON_EXTRACT(ip.provider_payload,'$.payer_email'))),'null'),''),NULLIF(NULLIF(TRIM(JSON_UNQUOTE(JSON_EXTRACT(ip.provider_payload,'$.customer_email'))),'null'),''),''),COALESCE(i.invoice_number,i.external_reference,''),
 ${stateSql('i', 'ip')}
 FROM subscription_invoices i JOIN subscriptions s ON s._id=i.subscription_id LEFT JOIN payment_transactions ip ON ip._id=i.payment_transaction_id AND ip.office_id=s.office_id AND ip.client_id=s.client_id
 LEFT JOIN payment_customers c ON c._id=COALESCE(ip.payment_customer_id,s.payment_customer_id) AND c.office_id=s.office_id AND c.client_id=s.client_id
 WHERE s.office_id=${office} AND s.client_id=${client}
 AND NOT EXISTS(SELECT 1 FROM subscription_invoices representative
 WHERE representative.subscription_id=i.subscription_id AND (
 (i.payment_transaction_id IS NOT NULL AND representative.payment_transaction_id=i.payment_transaction_id)
 OR (i.subscription_cycle_id IS NOT NULL AND representative.subscription_cycle_id=i.subscription_cycle_id))
 AND ((representative.paid_at IS NOT NULL)>(i.paid_at IS NOT NULL)
 OR ((representative.paid_at IS NOT NULL)=(i.paid_at IS NOT NULL) AND (
 (representative.invoice_number IS NOT NULL)>(i.invoice_number IS NOT NULL)
 OR ((representative.invoice_number IS NOT NULL)=(i.invoice_number IS NOT NULL) AND representative.id>i.id)))))

 UNION ALL
 SELECT p._id,'payment',p.created_at,p.amount,p.currency,COALESCE((SELECT g.name FROM gateways g WHERE g._id=p.gateway_id),''),p.expires_at,'one_time',COALESCE(NULLIF(TRIM(c.name),''),NULLIF(NULLIF(TRIM(JSON_UNQUOTE(JSON_EXTRACT(p.provider_payload,'$.customer.name'))),'null'),''),NULLIF(NULLIF(TRIM(JSON_UNQUOTE(JSON_EXTRACT(p.provider_payload,'$.payer.name'))),'null'),''),''),COALESCE(NULLIF(TRIM(c.email),''),NULLIF(NULLIF(TRIM(JSON_UNQUOTE(JSON_EXTRACT(p.provider_payload,'$.customer.email'))),'null'),''),NULLIF(NULLIF(TRIM(JSON_UNQUOTE(JSON_EXTRACT(p.provider_payload,'$.payer.email'))),'null'),''),NULLIF(NULLIF(TRIM(JSON_UNQUOTE(JSON_EXTRACT(p.provider_payload,'$.payer_email'))),'null'),''),NULLIF(NULLIF(TRIM(JSON_UNQUOTE(JSON_EXTRACT(p.provider_payload,'$.customer_email'))),'null'),''),''),COALESCE(p.external_reference,''),
 ${stateSql('p', 'p')}
 FROM payment_transactions p LEFT JOIN payment_customers c ON c._id=p.payment_customer_id AND c.office_id=p.office_id AND c.client_id=p.client_id
 WHERE p.office_id=${office} AND p.client_id=${client} AND p.checkout_session_id IS NULL AND NOT EXISTS(SELECT 1 FROM subscription_invoices i WHERE i.payment_transaction_id=p._id)`;
    const today = billingDayStart();
    const upcomingEnd = new Date(today.getTime() + 8 * 86400000);
    const base = Prisma.sql`SELECT id,kind,createdAt,amount,currency,gateway,dueAt,origin,customer,email,reference,
 CASE WHEN state IN ('open','partial') AND dueAt < ${today} THEN 'overdue' ELSE state END state FROM (${raw}) source`;
    const conditions = [Prisma.sql`1=1`];
    if (d.start && d.end && new Date(d.start) > new Date(d.end))
      throw new ConflictException('BILLING_INVALID_PERIOD');
    if (d.start) conditions.push(Prisma.sql`createdAt >= ${new Date(d.start)}`);
    if (d.end) conditions.push(Prisma.sql`createdAt <= ${new Date(d.end)}`);
    if (d.gateway) conditions.push(Prisma.sql`gateway = ${d.gateway}`);
    if (d.q) {
      const q = '%' + d.q + '%';
      conditions.push(
        Prisma.sql`(customer LIKE ${q} OR email LIKE ${q} OR reference LIKE ${q} OR id LIKE ${q})`,
      );
    }
    if (d.status !== 'all') conditions.push(Prisma.sql`state=${d.status}`);
    if (d.origin !== 'all') conditions.push(Prisma.sql`origin=${d.origin}`);
    if (d.timing !== 'all')
      conditions.push(
        d.timing === 'overdue'
          ? Prisma.sql`state='overdue'`
          : Prisma.sql`state IN ('open','partial') AND dueAt >= ${today} AND dueAt < ${upcomingEnd}`,
      );
    const where = Prisma.join(conditions, ' AND ');
    const counts = await this.db.$queryRaw<any[]>(
      Prisma.sql`SELECT COUNT(*) total FROM (${base}) b WHERE ${where}`,
    );
    const total = Number(counts[0].total),
      page = Math.min(d.page, Math.max(1, Math.ceil(total / 10)));
    const ids = await this.db.$queryRaw<any[]>(
      Prisma.sql`SELECT id,kind FROM (${base}) b WHERE ${where} ORDER BY createdAt DESC,id DESC LIMIT 10 OFFSET ${(page - 1) * 10}`,
    );
    const summary = await this.db.$queryRaw<any[]>(
      Prisma.sql`SELECT currency,state,COUNT(*) count,SUM(amount) amount FROM (${base}) b WHERE ${where} GROUP BY currency,state`,
    );
    const gateways = await this.db.$queryRaw<{ gateway: string }[]>(
      Prisma.sql`SELECT DISTINCT gateway FROM (${base}) b WHERE gateway <> '' ORDER BY gateway`,
    );
    return {
      gateways: gateways.map((g) => g.gateway),
      items: await Promise.all(
        ids.map((r) => this.detail(office, client, r.kind, r.id)),
      ),
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / 10)),
      summary: summary.map((r) => ({
        ...r,
        count: Number(r.count),
        amount: Number(r.amount),
      })),
    };
  }
  async detail(office: string, client: string, kind: string, id: string) {
    let source: any,
      payment: any,
      customer: any,
      gateway: any,
      subscriptionId: string | null = null;
    if (kind === 'session') {
      source = await this.db.checkoutSession.findFirst({
        where: {
          unique_id: id,
          office_id: office,
          client_id: client,
        },
        include: {
          payment_customer: true,
          gateway: true,
          items: true,
          payment_transactions: {
            orderBy: { id: 'desc' },
            include: { refunds: true },
            take: 100,
          },
        },
      });
      if (!source) throw new NotFoundException();
      payment =
        source.payment_transactions.find((p: any) => p.paid_at) ||
        source.payment_transactions[0];
      customer = source.payment_customer;
      gateway = source.gateway;
    } else if (kind === 'invoice') {
      source = await this.db.subscriptionInvoice.findFirst({
        where: {
          unique_id: id,
          subscription: { office_id: office, client_id: client },
        },
        include: {
          subscription: { include: { payment_customer: true, gateway: true } },
          payment_transaction: { include: { refunds: true } },
        },
      });
      if (!source) throw new NotFoundException();
      payment = source.payment_transaction;
      customer = source.subscription.payment_customer;
      gateway = source.subscription.gateway;
      subscriptionId = source.subscription_id;
    } else {
      source = await this.db.paymentTransaction.findFirst({
        where: { unique_id: id, office_id: office, client_id: client },
        include: { payment_customer: true, gateway: true, refunds: true },
      });
      if (!source) throw new NotFoundException();
      payment = source;
      customer = source.payment_customer;
      gateway = source.gateway;
    }
    if (
      payment?.payment_customer_id &&
      payment.payment_customer_id !== customer?.unique_id
    ) {
      const linked = await this.db.paymentCustomer.findFirst({
        where: {
          unique_id: payment.payment_customer_id,
          office_id: office,
          client_id: client,
        },
      });
      if (linked) customer = linked;
    }
    const payload = obj(payment?.provider_payload),
      payer = obj(payload.payer),
      buyer = obj(payload.customer);
    const clean = (v: unknown) =>
      typeof v === 'string' && v.trim() && v.trim() !== 'null' ? v.trim() : '';
    const customerName =
      clean(customer?.name) ||
      clean(buyer.name) ||
      clean(payer.name) ||
      [clean(payer.first_name), clean(payer.last_name)]
        .filter(Boolean)
        .join(' ');
    const customerEmail =
      clean(customer?.email) ||
      clean(buyer.email) ||
      clean(payer.email) ||
      clean(payload.payer_email) ||
      clean(payload.customer_email);
    const b = obj(obj(source.config).billing),
      manual = b.version === 1,
      received = Number(b.received || 0),
      attempted = !!payment || !!b.issueStartedAt;
    let status = financialStatus(
      payment?.status || source.status,
      payment?.paid_at || source.paid_at,
      received,
      source.amount,
    );
    const refunded = (payment?.refunds || [])
      .filter((r: any) =>
        ['approved', 'completed', 'succeeded', 'refunded'].includes(r.status),
      )
      .reduce((n: number, r: any) => n + r.amount, 0);
    if (refunded)
      status = refunded >= source.amount ? 'refunded' : 'partial_refund';
    const dueAt = b.dueAt || source.due_at || source.expires_at || null;
    status = dueStatus(status, dueAt);
    return {
      id,
      kind,
      number: source.invoice_number || source.code || id,
      customer: customerName || customerEmail || 'Não informado',
      email: customerEmail,
      customerId: customer?.unique_id || null,
      amount: source.amount,
      currency: source.currency,
      status,
      origin: manual
        ? 'manual'
        : subscriptionId || source.payment_type === 'recurring'
          ? 'recurring'
          : 'one_time',
      gateway: gateway?.name || '',
      dueAt,
      createdAt: source.created_at,
      paidAt: payment?.paid_at || source.paid_at || null,
      received,
      refunded,
      subscriptionId,
      orderRef: source.external_reference || null,
      checkoutUrl: paymentLink(payment?.checkout_url),
      description: source.description || '',
      timing:
        ['open', 'partial', 'overdue'].includes(status) && dueAt
          ? status === 'overdue'
            ? 'overdue'
            : 'upcoming'
          : null,
      actions: manualActions(manual, attempted, status, received),
      history: Array.isArray(b.history)
        ? b.history.map((e: any) => ({
            action: e.action,
            at: e.at,
            amount: e.amount,
            reason: e.reason,
            method: e.method,
            receivedAt: e.receivedAt,
          }))
        : [],
      items:
        source.items?.map((i: any) => ({
          name: i.name,
          quantity: i.quantity,
          unitAmount: i.unit_amount,
          totalAmount: i.total_amount,
        })) || [],
      actionNotice:
        status === 'failed' && !paymentLink(payment?.checkout_url)
          ? 'Não foi possível emitir a cobrança no gateway. Nenhum link de pagamento foi disponibilizado. A tentativa precisa ser verificada antes de emitir novamente.'
          : attempted
            ? 'Cobrança vinculada ao gateway. Baixa manual e cancelamento local bloqueados para evitar cobrança duplicada. Use o pós-venda para valores já pagos.'
            : null,
    };
  }
  async customers(office: string, client: string, q: string) {
    return this.db.paymentCustomer.findMany({
      where: {
        office_id: office,
        client_id: client,
        status: 'active',
        OR: [{ name: { contains: q } }, { email: { contains: q } }],
      },
      select: { unique_id: true, name: true, email: true },
      take: 30,
      orderBy: { name: 'asc' },
    });
  }
}
