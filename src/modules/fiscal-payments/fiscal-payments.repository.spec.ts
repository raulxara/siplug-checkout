import { FiscalPaymentsRepository } from './fiscal-payments.repository';
import type { PrismaService } from '../../infra/database/prisma/prisma.service';
jest.mock('../../infra/database/prisma/prisma.service', () => ({
  PrismaService: class {},
}));
describe('Fiscal confirmed payments', () => {
  const customer = {
    office_id: 'office',
    client_id: 'client',
    name: 'Buyer',
    email: 'buyer@example.test',
    document_type: 'cpf',
    document_value: '12345678909',
    phone: null,
    billing_address: {},
  };
  const session = {
    office_id: 'office',
    client_id: 'client',
    unique_id: 'session',
    external_reference: 'order',
    items: [
      {
        status: 'active',
        item_ref: 'product',
        name: 'Service',
        quantity: 1,
        unit_amount: 1000,
        total_amount: 1000,
      },
    ],
  };
  const invoice = {
    unique_id: 'cycle',
    subscription: {
      office_id: 'office',
      client_id: 'client',
      external_reference: 'order',
      payment_customer: customer,
    },
    amount: 1000,
    currency: 'BRL',
    paid_at: new Date(),
  };
  const tx = {
    unique_id: 'transaction',
    payment_type: 'one_time',
    amount: 1000,
    currency: 'BRL',
    paid_at: new Date(),
    checkout_session: session,
    payment_customer: customer,
    subscription_invoices: [],
  };
  const setup = () => {
    const db = {
      paymentTransaction: { findMany: jest.fn() },
      subscriptionInvoice: { findMany: jest.fn() },
      checkoutSession: { findFirst: jest.fn() },
    };
    return {
      db,
      repo: new FiscalPaymentsRepository(db as unknown as PrismaService),
    };
  };
  it('restricts the query to authenticated company and confirmed payments', async () => {
    const { db, repo } = setup();
    db.paymentTransaction.findMany.mockResolvedValue([tx]);
    const since = new Date();
    const r = await repo.list('office', 'client', since, 1);
    expect(db.paymentTransaction.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          office_id: 'office',
          client_id: 'client',
          paid_at: { gte: since },
          status: { in: ['paid', 'approved', 'completed'] },
        }),
      }),
    );
    expect(r.items[0].paymentId).toBe('transaction');
    expect(r.items[0].items[0].totalAmount).toBe(1000);
  });
  it('does not expose a related customer or cart from another tenant', async () => {
    const { db, repo } = setup();
    db.paymentTransaction.findMany.mockResolvedValue([
      {
        ...tx,
        payment_customer: { ...customer, office_id: 'other' },
        checkout_session: { ...session, office_id: 'other' },
      },
    ]);
    const r = await repo.list('office', 'client', new Date(), 1);
    expect(r.items[0].customer).toBeNull();
    expect(r.items[0].items).toEqual([]);
  });
  it('waits for recurring invoice identity before exposing a transaction', async () => {
    const { db, repo } = setup();
    db.paymentTransaction.findMany.mockResolvedValue([
      { ...tx, payment_type: 'recurring' },
    ]);
    expect((await repo.list('office', 'client', new Date(), 1)).items).toEqual(
      [],
    );
  });
  it('keeps the same cycle identity when a later transaction is linked', async () => {
    const { db, repo } = setup();
    db.subscriptionInvoice.findMany.mockResolvedValue([invoice]);
    db.checkoutSession.findFirst.mockResolvedValue(session);
    const before = await repo.invoices('office', 'client', new Date(), 1);
    db.paymentTransaction.findMany.mockResolvedValue([
      { ...tx, payment_type: 'recurring', subscription_invoices: [invoice] },
    ]);
    const after = await repo.list('office', 'client', new Date(), 1);
    expect(before.items[0].paymentId).toBe('invoice:cycle');
    expect(after.items[0].paymentId).toBe(before.items[0].paymentId);
  });
});
