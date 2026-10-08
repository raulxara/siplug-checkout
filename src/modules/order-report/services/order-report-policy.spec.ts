import { validateOrderFilters } from './order-report-policy';
describe('Order report input boundaries', () => {
  it('rejects untrusted sort expressions', () => {
    expect(() =>
      validateOrderFilters({ sort: 'amount DESC; DROP TABLE users' }),
    ).toThrow();
  });
  it('rejects unlimited pages and invalid status', () => {
    expect(() => validateOrderFilters({ perPage: 100000 })).toThrow();
    expect(() => validateOrderFilters({ statuses: ['anything'] })).toThrow();
  });
  it('rejects inverted dates', () => {
    expect(() =>
      validateOrderFilters({
        start: '2026-10-08T00:00:00Z',
        end: '2026-10-07T00:00:00Z',
      }),
    ).toThrow();
  });
  it('keeps a supplied snapshot and typed filters', () => {
    const f = validateOrderFilters({
      asOf: '2026-10-07T00:00:00Z',
      statuses: ['pago'],
      methods: ['payment_link'],
    });
    expect(f.asOf).toBe('2026-10-07T00:00:00Z');
    expect(f.perPage).toBe(10);
  });
});
