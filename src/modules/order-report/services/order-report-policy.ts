import { BadRequestException } from '@nestjs/common';
import { OrderReportFilters } from '../entities/order-report.entity';
export function validateOrderFilters(f: OrderReportFilters) {
  if (
    !f ||
    typeof f !== 'object' ||
    Array.isArray(f) ||
    (f.q !== undefined && typeof f.q !== 'string') ||
    [f.methods, f.statuses].some(
      (v) =>
        v !== undefined &&
        (!Array.isArray(v) ||
          v.length > 20 ||
          v.some((x) => typeof x !== 'string')),
    ) ||
    [f.start, f.end, f.asOf].some(
      (v) => v !== undefined && typeof v !== 'string',
    )
  )
    throw new BadRequestException('Filtros inválidos.');
  if (f.view !== undefined && !['orders', 'abandoned'].includes(f.view))
    throw new BadRequestException('Relatório inválido.');
  const sort = f.sort ?? 'createdAt';
  const direction = f.direction ?? 'desc';
  const page = f.page ?? 1;
  const perPage = f.perPage ?? 10;
  if (
    ![
      'id',
      'createdAt',
      'customer',
      'items',
      'amount',
      'method',
      'status',
    ].includes(sort) ||
    !['asc', 'desc'].includes(direction) ||
    !Number.isInteger(page) ||
    page < 1 ||
    page > 100000 ||
    !Number.isInteger(perPage) ||
    perPage < 1 ||
    perPage > 1000 ||
    (f.q?.length ?? 0) > 150
  )
    throw new BadRequestException('Filtros inválidos.');
  for (const value of [f.start, f.end, f.asOf])
    if (
      value &&
      (!/^\d{4}-\d{2}-\d{2}T/.test(value) ||
        !Number.isFinite(Date.parse(value)))
    )
      throw new BadRequestException('Data inválida.');
  if (f.start && f.end && f.start > f.end)
    throw new BadRequestException('Período inválido.');
  if (
    (f.statuses ?? []).some(
      (s) =>
        ![
          'pago',
          'em_analise',
          'negado',
          'reembolsado',
          'pendente',
          'sem_tentativa',
          'cancelado',
          'expirado',
          'contestado',
        ].includes(s),
    ) ||
    (f.methods ?? []).some(
      (m) =>
        ![
          'cartao_credito',
          'pix',
          'boleto',
          'debito',
          'payment_link',
          'card',
          'bank_transfer',
          'wallet',
          'paypal',
          'venmo',
          'nao_informado',
        ].includes(m),
    )
  )
    throw new BadRequestException('Filtro inválido.');
  return {
    ...f,
    sort,
    direction,
    page,
    perPage,
    asOf: f.asOf ?? new Date().toISOString(),
  };
}
