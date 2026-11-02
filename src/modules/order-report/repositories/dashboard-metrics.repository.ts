import { BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { OrderReportFilters } from '../entities/order-report.entity';
import { validateOrderFilters } from '../services/order-report-policy';

/** Read-only aggregates. Currency groups are never added together. */
export class DashboardMetricsRepository {
  constructor(private readonly db: PrismaService) {}
  async read(officeId: string, clientId: string, input: OrderReportFilters) {
    const f = validateOrderFilters(input);
    if (
      !f.start ||
      !f.end ||
      Date.parse(f.end) - Date.parse(f.start) > 365 * 86400000
    )
      throw new BadRequestException('Informe um período de até 365 dias.');
    const start = new Date(f.start),
      end = new Date(f.end);
    const paid = Prisma.sql`(t.paid_at IS NOT NULL OR t.status IN ('paid','approved','completed','refunded','chargeback'))`;
    const [
      receipts,
      attempts,
      refunds,
      subscriptions,
      cohorts,
      products,
      customers,
    ] = await this.db.$transaction(
      [
        this.db.$queryRaw<Array<Record<string, unknown>>>(Prisma.sql`
        SELECT t.currency, COUNT(*) AS payments, SUM(t.amount) AS received,
          COUNT(DISTINCT COALESCE(NULLIF(JSON_UNQUOTE(JSON_EXTRACT(s.config,'$.parentOrderId')),'null'), s.external_reference, s._id, t._id)) AS paidOrders,
          SUM(CASE WHEN COALESCE(NULLIF(JSON_UNQUOTE(JSON_EXTRACT(t.config,'$.actualPaymentMethod')),'null'),t.payment_method)='pix' THEN 1 ELSE 0 END) AS pixPayments,
          SUM(CASE WHEN t.status='chargeback' THEN 1 ELSE 0 END) AS chargebacks
        FROM payment_transactions t LEFT JOIN checkout_sessions s ON s._id=t.checkout_session_id AND s.office_id=t.office_id AND s.client_id=t.client_id
        WHERE t.office_id=${officeId} AND t.client_id=${clientId} AND ${paid}
          AND COALESCE(t.paid_at,t.created_at) BETWEEN ${start} AND ${end} GROUP BY t.currency`),
        this.db.$queryRaw<Array<Record<string, unknown>>>(Prisma.sql`
        SELECT t.currency, COUNT(*) AS cardAttempts, SUM(CASE WHEN ${paid} THEN 1 ELSE 0 END) AS cardApproved
        FROM payment_transactions t WHERE t.office_id=${officeId} AND t.client_id=${clientId}
          AND COALESCE(NULLIF(JSON_UNQUOTE(JSON_EXTRACT(t.config,'$.actualPaymentMethod')),'null'), t.payment_method) IN ('card','credit_card','cartao_credito')
          AND t.status IN ('paid','approved','completed','refunded','chargeback','failed','rejected')
          AND t.created_at BETWEEN ${start} AND ${end} GROUP BY t.currency`),
        this.db.$queryRaw<Array<Record<string, unknown>>>(Prisma.sql`
        SELECT currency, COUNT(*) AS refundCount, SUM(amount) AS refunded FROM payment_refunds
        WHERE office_id=${officeId} AND client_id=${clientId} AND status IN ('succeeded','approved','completed','refunded')
          AND updated_at BETWEEN ${start} AND ${end} GROUP BY currency`),
        this.db.$queryRaw<Array<Record<string, unknown>>>(Prisma.sql`
        SELECT s.currency, SUM(CASE WHEN s.status IN ('active','authorized') THEN 1 ELSE 0 END) AS activeSubscriptions,
          SUM(CASE WHEN s.canceled_at BETWEEN ${start} AND ${end} THEN 1 ELSE 0 END) AS canceledSubscriptions,
          SUM(CASE WHEN s.status IN ('active','authorized') AND p.interval_count>0 AND p.interval_type IN ('month','monthly','months') THEN s.amount/p.interval_count
                   WHEN s.status IN ('active','authorized') AND p.interval_count>0 AND p.interval_type IN ('year','yearly','years') THEN s.amount/(12*p.interval_count) ELSE 0 END) AS mrr,
          SUM(CASE WHEN s.status IN ('active','authorized') AND (p._id IS NULL OR p.interval_count<=0 OR p.interval_type NOT IN ('month','monthly','months','year','yearly','years')) THEN 1 ELSE 0 END) AS mrrUnclassified
        FROM subscriptions s LEFT JOIN subscription_plans p ON p._id=s.subscription_plan_id AND p.office_id=s.office_id AND p.client_id=s.client_id
        WHERE s.office_id=${officeId} AND s.client_id=${clientId} GROUP BY s.currency`),
        this.db.$queryRaw<Array<Record<string, unknown>>>(Prisma.sql`
        WITH payment_state AS (
          SELECT checkout_session_id,
            SUM(CASE WHEN paid_at IS NOT NULL OR status IN ('paid','approved','completed','refunded','chargeback') THEN amount ELSE 0 END) AS received,
            MAX(CASE WHEN status IN ('pending','processing','in_process','authorized','in_analysis') AND (expires_at IS NULL OR expires_at>UTC_TIMESTAMP()) THEN 1 ELSE 0 END) AS awaiting,
            MAX(updated_at) AS lastActivity,
            MIN(CASE WHEN paid_at IS NOT NULL OR status IN ('paid','approved','completed','refunded','chargeback') THEN created_at END) AS successfulAttemptAt
          FROM payment_transactions WHERE office_id=${officeId} AND client_id=${clientId} GROUP BY checkout_session_id
        ), grouped AS (
          SELECT s.currency,
            COALESCE(NULLIF(JSON_UNQUOTE(JSON_EXTRACT(s.config,'$.parentOrderId')),'null'),s.external_reference,s._id) AS orderRef,
            MIN(s.created_at) AS startedAt,
            GREATEST(MAX(s.updated_at),COALESCE(MAX(p.lastActivity),MAX(s.updated_at))) AS lastActivity,
            COALESCE(MAX(CAST(NULLIF(JSON_UNQUOTE(JSON_EXTRACT(s.config,'$.initialTotal')),'null') AS UNSIGNED)),SUM(s.amount)) AS amount,
            SUM(COALESCE(p.received,0)) AS received, MAX(COALESCE(p.awaiting,0)) AS awaiting,
            MAX(CASE WHEN p.successfulAttemptAt>=DATE_ADD(s.created_at,INTERVAL 30 MINUTE) THEN 1 ELSE 0 END) AS recovered,
            MAX(NULLIF(JSON_UNQUOTE(JSON_EXTRACT(s.config,'$.analytics.sessionKey')),'null')) AS sessionKey
          FROM checkout_sessions s LEFT JOIN payment_state p ON p.checkout_session_id=s._id
          WHERE s.office_id=${officeId} AND s.client_id=${clientId} GROUP BY s.currency,orderRef
        ) SELECT currency,COUNT(*) AS startedOrders,
          SUM(CASE WHEN received>=amount AND amount>0 THEN 1 ELSE 0 END) AS completedOrders,
          SUM(CASE WHEN received=0 AND awaiting=0 AND lastActivity<DATE_SUB(UTC_TIMESTAMP(),INTERVAL 30 MINUTE) THEN 1 ELSE 0 END) AS abandonedOrders,
          SUM(CASE WHEN received=0 AND awaiting=0 AND lastActivity<DATE_SUB(UTC_TIMESTAMP(),INTERVAL 30 MINUTE) THEN amount ELSE 0 END) AS abandonedAmount,
          SUM(CASE WHEN received>=amount AND amount>0 AND recovered=1 THEN 1 ELSE 0 END) AS recoveredOrders,
          SUM(CASE WHEN received>=amount AND amount>0 AND recovered=1 THEN amount ELSE 0 END) AS recoveredAmount,
          COUNT(DISTINCT CASE WHEN received>=amount AND amount>0 THEN sessionKey END) AS completedSessions
        FROM grouped WHERE startedAt BETWEEN ${start} AND ${end} GROUP BY currency`),
        this.db.$queryRaw<Array<Record<string, unknown>>>(Prisma.sql`
        SELECT s.currency,it.item_ref AS productId,MAX(it.name) AS name,SUM(it.quantity) AS quantity,SUM(it.total_amount) AS amount
        FROM checkout_session_items it INNER JOIN checkout_sessions s ON s._id=it.checkout_session_id
        WHERE s.office_id=${officeId} AND s.client_id=${clientId} AND s.created_at BETWEEN ${start} AND ${end}
          AND EXISTS(SELECT 1 FROM payment_transactions t WHERE t.checkout_session_id=s._id AND t.office_id=${officeId} AND t.client_id=${clientId} AND ${paid})
        GROUP BY s.currency,it.item_ref ORDER BY quantity DESC LIMIT 10`),
        this.db.$queryRaw<Array<Record<string, unknown>>>(Prisma.sql`
        SELECT currency,
          COUNT(DISTINCT CASE WHEN firstPaid>=${start} THEN payment_customer_id END) AS newCustomers,
          COUNT(DISTINCT CASE WHEN firstPaid<${start} THEN payment_customer_id END) AS returningCustomers
        FROM (
          SELECT t.currency,t.payment_customer_id,COALESCE(t.paid_at,t.created_at) AS paidAt,
            MIN(COALESCE(t.paid_at,t.created_at)) OVER(PARTITION BY t.payment_customer_id) AS firstPaid
          FROM payment_transactions t WHERE t.office_id=${officeId} AND t.client_id=${clientId}
            AND t.payment_customer_id IS NOT NULL AND ${paid}
        ) buyers WHERE paidAt BETWEEN ${start} AND ${end} GROUP BY currency`),
      ],
      { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead },
    );
    const groups = new Map<string, Record<string, number | string>>();
    for (const rows of [
      receipts,
      attempts,
      refunds,
      subscriptions,
      cohorts,
      customers,
    ])
      for (const row of rows) {
        const currency = String(row.currency);
        const group = groups.get(currency) ?? {
          currency,
          payments: 0,
          received: 0,
          paidOrders: 0,
          pixPayments: 0,
          chargebacks: 0,
          cardAttempts: 0,
          cardApproved: 0,
          refundCount: 0,
          refunded: 0,
          activeSubscriptions: 0,
          canceledSubscriptions: 0,
          mrr: 0,
          mrrUnclassified: 0,
          startedOrders: 0,
          completedOrders: 0,
          abandonedOrders: 0,
          abandonedAmount: 0,
          recoveredOrders: 0,
          recoveredAmount: 0,
          completedSessions: 0,
          newCustomers: 0,
          returningCustomers: 0,
        };
        for (const [key, value] of Object.entries(row))
          if (key !== 'currency') group[key] = Math.round(Number(value ?? 0));
        groups.set(currency, group);
      }
    return {
      products: products.map((row) => ({
        ...row,
        quantity: Number(row.quantity),
        amount: Number(row.amount),
      })),
      timezone: 'UTC',
      from: f.start,
      to: f.end,
      currencies: [...groups.values()],
      asOf: new Date().toISOString(),
    };
  }
}
