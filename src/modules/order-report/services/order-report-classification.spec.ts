import {
  reportScope,
  transactionPriority,
} from './order-report-classification';
import { validateOrderFilters } from './order-report-policy';
describe('Sales report boundaries', () => {
  it('keeps abandoned statuses outside the default report', () => {
    expect(reportScope(undefined).sql).toContain(
      "NOT IN ('pendente','sem_tentativa')",
    );
    expect(reportScope('orders').sql).toBe(reportScope(undefined).sql);
    expect(reportScope('abandoned').sql).toContain(
      "status IN ('pendente','sem_tentativa')",
    );
  });
  it('prioritizes settled attempts before newer pending attempts', () => {
    expect(transactionPriority.sql).toContain(
      "'paid','approved','completed','refunded','chargeback'",
    );
  });
  it('accepts the derived empty-cart status but rejects unrestricted report scopes', () => {
    expect(
      validateOrderFilters({ view: 'abandoned', statuses: ['sem_tentativa'] }),
    ).toMatchObject({ view: 'abandoned' });
    expect(() => validateOrderFilters({ view: 'all' as 'orders' })).toThrow();
  });
});
