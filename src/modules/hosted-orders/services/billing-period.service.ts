export function billingPeriodEnd(
  start: Date,
  interval: string,
  count: number,
): Date {
  const end = new Date(start);
  const day = end.getUTCDate();
  end.setUTCDate(1);
  if (interval === 'year') end.setUTCFullYear(end.getUTCFullYear() + count);
  else end.setUTCMonth(end.getUTCMonth() + count);
  const last = new Date(
    Date.UTC(end.getUTCFullYear(), end.getUTCMonth() + 1, 0),
  ).getUTCDate();
  end.setUTCDate(Math.min(day, last));
  return end;
}
