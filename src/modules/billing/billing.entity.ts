export function financialStatus(
  status: string,
  paid: Date | null,
  received = 0,
  amount = 0,
): string {
  if (['refunded', 'partially_refunded'].includes(status))
    return status === 'refunded' ? 'refunded' : 'partial_refund';
  if (paid || ['paid', 'approved', 'completed', 'succeeded'].includes(status))
    return 'paid';
  if (['canceled', 'cancelled', 'void'].includes(status)) return 'canceled';
  if (received >= amount && received > 0) return 'paid';
  if (received > 0) return 'partial';
  if (['failed', 'rejected', 'declined'].includes(status)) return 'failed';
  return status === 'draft' ? 'draft' : 'open';
}
export function paymentLink(url: unknown): string | null {
  if (typeof url !== 'string') return null;
  try {
    const u = new URL(url);
    return u.protocol === 'https:' && !u.username && !u.password
      ? u.href
      : null;
  } catch {
    return null;
  }
}
export function manualActions(
  manual: boolean,
  attempted: boolean,
  status: string,
  received: number,
): string[] {
  if (!manual || attempted || ['paid', 'canceled', 'refunded'].includes(status))
    return [];
  return received > 0 ? ['receive'] : ['issue', 'receive', 'cancel'];
}

// Billing uses calendar days in Brasília, not the instant a charge became due.
export function billingDayStart(now = new Date()): Date {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const part = (type: string) => parts.find((p) => p.type === type)!.value;
  return new Date(
    `${part('year')}-${part('month')}-${part('day')}T00:00:00-03:00`,
  );
}

export function dueStatus(
  status: string,
  dueAt: Date | string | null,
  now = new Date(),
): string {
  return ['open', 'partial'].includes(status) &&
    dueAt &&
    new Date(dueAt) < billingDayStart(now)
    ? 'overdue'
    : status;
}
