import {
  reportScope,
  transactionPriority,
} from '../services/order-report-classification';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import {
  OrderReportFilters,
  OrderReportRow,
  OrderCartItem,
} from '../entities/order-report.entity';
import { validateOrderFilters } from '../services/order-report-policy';
@Injectable()
export class OrderReportRepository {
  constructor(private readonly db: PrismaService) {}
  async list(officeId: string, clientId: string, input: OrderReportFilters) {
    const f = validateOrderFilters(input);
    // Both the session and related transaction/customer are scoped to the authorized tenant.
    const base = Prisma.sql`WITH ranked AS (
      SELECT t.*, ROW_NUMBER() OVER (PARTITION BY checkout_session_id ORDER BY
        ${transactionPriority}, id DESC) AS rn
      FROM payment_transactions t WHERE office_id = ${officeId} AND client_id = ${clientId}
    ), report AS (
      SELECT s._id AS id, COALESCE(NULLIF(s.code,''),s._id) AS code,
        COALESCE(NULLIF(pc.name,''), NULLIF(JSON_UNQUOTE(JSON_EXTRACT(t.provider_payload,'$.payer.name')),'null'), NULLIF(TRIM(CONCAT_WS(' ',NULLIF(JSON_UNQUOTE(JSON_EXTRACT(t.provider_payload,'$.payer.first_name')),'null'),NULLIF(JSON_UNQUOTE(JSON_EXTRACT(t.provider_payload,'$.payer.last_name')),'null'))),''),'Não informado') AS customer,
        COALESCE(pc.email,NULLIF(JSON_UNQUOTE(JSON_EXTRACT(t.provider_payload,'$.payer.email')),'null'),NULLIF(JSON_UNQUOTE(JSON_EXTRACT(t.provider_payload,'$.payer_email')),'null'),NULLIF(JSON_UNQUOTE(JSON_EXTRACT(t.provider_payload,'$.customer_email')),'null')) AS email,
        s.created_at AS createdAt, COALESCE(i.quantity,0) AS items, s.amount, s.currency,
        t.payment_method AS requestedMethod,
        NULLIF(NULLIF(JSON_UNQUOTE(JSON_EXTRACT(t.config,'$.actualPaymentMethod')),'null'),'') AS actualMethod,
        CASE COALESCE(NULLIF(NULLIF(JSON_UNQUOTE(JSON_EXTRACT(t.config,'$.actualPaymentMethod')),'null'),''),NULLIF(t.payment_method,''),'nao_informado') WHEN 'credit_card' THEN 'cartao_credito' WHEN 'debit_card' THEN 'debito' WHEN 'ticket' THEN 'boleto' ELSE COALESCE(NULLIF(NULLIF(JSON_UNQUOTE(JSON_EXTRACT(t.config,'$.actualPaymentMethod')),'null'),''),NULLIF(t.payment_method,''),'nao_informado') END AS method,
        CASE WHEN t._id IS NULL THEN 'sem_tentativa' ELSE CASE t.status WHEN 'paid' THEN 'pago' WHEN 'approved' THEN 'pago' WHEN 'completed' THEN 'pago' WHEN 'authorized' THEN 'em_analise' WHEN 'in_analysis' THEN 'em_analise' WHEN 'in_process' THEN 'em_analise' WHEN 'failed' THEN 'negado' WHEN 'rejected' THEN 'negado' WHEN 'refunded' THEN 'reembolsado' WHEN 'chargeback' THEN 'contestado' WHEN 'canceled' THEN 'cancelado' WHEN 'cancelled' THEN 'cancelado' WHEN 'expired' THEN 'expirado' WHEN 'pending' THEN 'pendente' ELSE COALESCE(t.status,'nao_informado') END END AS status
      FROM checkout_sessions s
      LEFT JOIN ranked t ON t.checkout_session_id=s._id AND t.rn=1
      LEFT JOIN payment_customers pc ON pc._id=COALESCE(t.payment_customer_id,s.payment_customer_id) AND pc.office_id=s.office_id AND pc.client_id=s.client_id
      LEFT JOIN (SELECT it.checkout_session_id,SUM(it.quantity) quantity FROM checkout_session_items it INNER JOIN checkout_sessions own ON own._id=it.checkout_session_id WHERE own.office_id=${officeId} AND own.client_id=${clientId} GROUP BY it.checkout_session_id) i ON i.checkout_session_id=s._id
      WHERE s.office_id=${officeId} AND s.client_id=${clientId} AND s.created_at <= ${new Date(f.asOf)}
    )`;
    const conditions: Prisma.Sql[] = [reportScope(f.view)];
    if (f.q) {
      const q = '%' + f.q.replace(/[!%_]/g, (c) => '!' + c) + '%';
      conditions.push(
        Prisma.sql`(id LIKE ${q} ESCAPE '!' OR code LIKE ${q} ESCAPE '!' OR customer LIKE ${q} ESCAPE '!' OR email LIKE ${q} ESCAPE '!')`,
      );
    }
    if (f.start) conditions.push(Prisma.sql`createdAt >= ${new Date(f.start)}`);
    if (f.end) conditions.push(Prisma.sql`createdAt <= ${new Date(f.end)}`);
    if (f.methods?.length)
      conditions.push(Prisma.sql`method IN (${Prisma.join(f.methods)})`);
    if (f.statuses?.length)
      conditions.push(Prisma.sql`status IN (${Prisma.join(f.statuses)})`);
    const where = Prisma.join(conditions, ' AND ');
    const column = Prisma.raw('`' + (f.sort === 'id' ? 'code' : f.sort) + '`');
    const direction = Prisma.raw(f.direction.toUpperCase());
    const [rows, totals, cartItems] = await this.db.$transaction(
      [
        this.db.$queryRaw<
          Array<Omit<OrderReportRow, 'createdAt'> & { createdAt: Date }>
        >(
          Prisma.sql`${base} SELECT * FROM report WHERE ${where} ORDER BY ${column} ${direction}, id ASC LIMIT ${f.perPage} OFFSET ${(f.page - 1) * f.perPage}`,
        ),
        this.db.$queryRaw<Array<{ total: bigint; amount: unknown }>>(
          Prisma.sql`${base} SELECT COUNT(*) AS total, COALESCE(SUM(amount),0) AS amount FROM report WHERE ${where}`,
        ),
        this.db.$queryRaw<OrderCartItem[]>(
          Prisma.sql`${base}, selected AS (
            SELECT id FROM report WHERE ${where} ORDER BY ${column} ${direction}, id ASC
            LIMIT ${f.perPage} OFFSET ${(f.page - 1) * f.perPage}
          ) SELECT it._id AS id, it.checkout_session_id AS checkoutSessionId,
            it.item_ref AS itemRef, it.name, it.quantity,
            it.unit_amount AS unitAmount, it.total_amount AS totalAmount
          FROM checkout_session_items it
          INNER JOIN selected s ON s.id=it.checkout_session_id
          ORDER BY it.id ASC`,
        ),
      ],
      { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead },
    );
    const carts = new Map<string, OrderCartItem[]>();
    for (const item of cartItems) {
      const cart = carts.get(item.checkoutSessionId) ?? [];
      cart.push({
        ...item,
        quantity: Number(item.quantity),
        unitAmount: Number(item.unitAmount),
        totalAmount: Number(item.totalAmount),
      });
      carts.set(item.checkoutSessionId, cart);
    }
    const total = Number(totals[0].total);
    const amount = Number(totals[0].amount);
    return {
      items: rows.map((r) => ({
        ...r,
        createdAt: new Date(r.createdAt).toISOString(),
        items: Number(r.items),
        cart: carts.get(r.id) ?? [],
        amount: Number(r.amount),
      })),
      total,
      page: f.page,
      perPage: f.perPage,
      totalPages: Math.ceil(total / f.perPage),
      summary: {
        total,
        amount,
        average: total ? Math.round(amount / total) : 0,
      },
      asOf: f.asOf,
    };
  }
}
