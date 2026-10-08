import { OrderReportRepository } from './order-report.repository';
import { PrismaService } from '../../../infra/database/prisma/prisma.service';
describe('Order report cart', () => {
  it('groups items by the session public ID, keeps empty carts and scopes the batched query', async () => {
    const query = jest.fn();
    const db = {
      $queryRaw: query,
      $transaction: jest.fn().mockResolvedValue([
        [
          { id: 'session-a', createdAt: new Date(), items: 2, amount: 500 },
          { id: 'session-b', createdAt: new Date(), items: 0, amount: 0 },
        ],
        [{ total: 2n, amount: 500 }],
        [
          {
            id: 'item-a',
            checkoutSessionId: 'session-a',
            itemRef: 'product-a',
            name: 'Historical name',
            quantity: 2,
            unitAmount: 250,
            totalAmount: 500,
          },
        ],
      ]),
    };
    const report = await new OrderReportRepository(
      db as unknown as PrismaService,
    ).list('office-a', 'client-a', {});
    expect(report.items[0].cart).toEqual([
      expect.objectContaining({
        name: 'Historical name',
        quantity: 2,
        checkoutSessionId: 'session-a',
      }),
    ]);
    expect(report.items[1].cart).toEqual([]);
    expect(query).toHaveBeenCalledTimes(3);
    const sql = query.mock.calls[2][0];
    expect(sql.values).toContain('office-a');
    expect(sql.values).toContain('client-a');
    expect(sql.sql).toContain(
      'INNER JOIN selected s ON s.id=it.checkout_session_id',
    );
  });
});
