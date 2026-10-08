import { billingPeriodEnd } from './billing-period.service';
describe('billing periods', () => {
  it('clamps month ends without carrying into another period', () => {
    expect(
      billingPeriodEnd(
        new Date('2026-01-31T12:00:00Z'),
        'month',
        1,
      ).toISOString(),
    ).toBe('2026-02-28T12:00:00.000Z');
  });
  it('clamps leap day for annual plans', () => {
    expect(
      billingPeriodEnd(
        new Date('2024-02-29T12:00:00Z'),
        'year',
        1,
      ).toISOString(),
    ).toBe('2025-02-28T12:00:00.000Z');
  });
});
