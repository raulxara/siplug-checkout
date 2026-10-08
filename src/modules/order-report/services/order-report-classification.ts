import { Prisma } from '@prisma/client';
import { OrderReportFilters } from '../entities/order-report.entity';

/** Scope is applied before filters, totals, pagination and cart queries. */
export function reportScope(view: OrderReportFilters['view']): Prisma.Sql {
  return view === 'abandoned'
    ? Prisma.sql`status IN ('pendente','sem_tentativa')`
    : Prisma.sql`status NOT IN ('pendente','sem_tentativa')`;
}

/** Settled attempts take precedence over later incomplete retries. */
export const transactionPriority = Prisma.sql`CASE WHEN status IN ('paid','approved','completed','refunded','chargeback') THEN 0 ELSE 1 END`;
