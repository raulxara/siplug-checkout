// Run explicitly: RUN_DASHBOARD_SQL_TESTS=1 node -r ts-node/register test/dashboard-metrics.integration.cjs
// Uses connection-local temporary tables. No persistent schema or business data changes.
if (process.env.RUN_DASHBOARD_SQL_TESTS !== '1')
  throw new Error('Explicit opt-in required: RUN_DASHBOARD_SQL_TESTS=1');
const assert = require('node:assert/strict');
const mariadb = require('mariadb');
const { DashboardMetricsRepository } = require(
  process.cwd() +
    '/src/modules/order-report/repositories/dashboard-metrics.repository',
);
(async () => {
  const u = new URL(process.env.DATABASE_URL);
  const db = await mariadb.createConnection({
    host: u.hostname,
    port: Number(u.port || 3306),
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    database: u.pathname.slice(1),
    timezone: 'Z',
  });
  try {
    await db.query("SET time_zone='+00:00'");
    // Connection-local tables shadow real tables only in this connection and disappear on disconnect.
    for (const table of [
      'payment_transactions',
      'checkout_sessions',
      'checkout_session_items',
      'payment_refunds',
      'subscriptions',
      'subscription_plans',
    ]) {
      const schema = (await db.query('SHOW CREATE TABLE ' + table))[0][
        'Create Table'
      ];
      const temporary = schema
        .replace('CREATE TABLE', 'CREATE TEMPORARY TABLE')
        .split('\n')
        .filter((line) => !line.trimStart().startsWith('CONSTRAINT '))
        .join('\n')
        .replace(/,\n\)/g, '\n)');
      await db.query(temporary);
    }
    const id = (n) => '00000000-0000-4000-8000-' + String(n).padStart(12, '0');
    const office = id(1),
      client = id(2),
      payer = id(3),
      gateway = id(4),
      now = new Date(),
      old = new Date(now.getTime() - 2 * 86400000),
      recent = new Date(now.getTime() - 3600000);
    const insert = (table, row) =>
      db.query(
        'INSERT INTO ' +
          table +
          ' (' +
          Object.keys(row).join(',') +
          ') VALUES (' +
          Object.keys(row)
            .map(() => '?')
            .join(',') +
          ')',
        Object.values(row),
      );
    const session = async (n, amount, config = {}, tenant = office) =>
      insert('checkout_sessions', {
        _id: id(n),
        office_id: tenant,
        client_id: client,
        amount,
        currency: 'BRL',
        payment_type: 'one_time',
        status: 'created',
        config: JSON.stringify(config),
        created_at: old,
        updated_at: old,
      });
    const payment = async (
      n,
      sessionId,
      amount,
      status = 'paid',
      tenant = office,
    ) =>
      insert('payment_transactions', {
        _id: id(n),
        office_id: tenant,
        client_id: client,
        checkout_session_id: id(sessionId),
        payment_customer_id: payer,
        gateway_id: gateway,
        payment_type: 'one_time',
        payment_method: 'pix',
        amount,
        currency: 'BRL',
        status,
        paid_at: status === 'paid' ? recent : null,
        expires_at:
          status === 'pending' ? new Date(now.getTime() + 86400000) : null,
        created_at: recent,
        updated_at: recent,
      });
    await session(10, 10000, { parentOrderId: id(100), initialTotal: 11000 });
    await session(11, 1000, { parentOrderId: id(100) });
    await payment(20, 10, 10000);
    await session(12, 2000); // abandoned, no charge
    await session(13, 3000);
    await payment(21, 13, 3000, 'pending'); // valid pending charge must not be abandoned
    await session(14, 4000);
    await payment(22, 14, 4000); // successful retry after inactivity
    await session(15, 999999, {}, id(999));
    await payment(23, 15, 999999, 'paid', id(999)); // foreign office
    await insert('payment_refunds', {
      _id: id(30),
      office_id: office,
      client_id: client,
      payment_transaction_id: id(20),
      amount: 1000,
      currency: 'BRL',
      status: 'succeeded',
      created_at: recent,
      updated_at: recent,
    });
    await insert('payment_refunds', {
      _id: id(31),
      office_id: office,
      client_id: client,
      payment_transaction_id: id(20),
      amount: 2000,
      currency: 'BRL',
      status: 'created',
      created_at: recent,
      updated_at: recent,
    });
    await insert('checkout_session_items', {
      _id: id(40),
      checkout_session_id: id(10),
      item_ref: id(41),
      name: 'Test product',
      quantity: 2,
      unit_amount: 5000,
      total_amount: 10000,
      created_at: old,
      updated_at: old,
    });
    for (const [n, amount, interval] of [
      [50, 6000, 'month'],
      [51, 120000, 'year'],
    ]) {
      await insert('subscription_plans', {
        _id: id(n),
        office_id: office,
        client_id: client,
        name: 'Plan ' + n,
        slug: 'plan-' + n,
        amount,
        currency: 'BRL',
        interval_type: interval,
        interval_count: 1,
        created_at: old,
        updated_at: old,
      });
      await insert('subscriptions', {
        _id: id(n + 10),
        office_id: office,
        client_id: client,
        subscription_plan_id: id(n),
        payment_customer_id: payer,
        amount,
        currency: 'BRL',
        status: 'active',
        created_at: old,
        updated_at: old,
      });
    }
      await session(16,500); await payment(26,16,500);
    await db.query("UPDATE checkout_sessions SET currency='USD' WHERE _id=?",[id(16)]);
    await db.query("UPDATE payment_transactions SET currency='USD',payment_customer_id=? WHERE _id=?",[id(777),id(26)]);
    await payment(25,14,4000,'failed');
    await db.query("UPDATE payment_transactions SET config=? WHERE _id IN (?,?)",[JSON.stringify({actualPaymentMethod:'credit_card'}),id(22),id(25)]);
    await session(70,100);await payment(80,70,100);
    const historical=new Date(now.getTime()-10*86400000);
    await db.query('UPDATE checkout_sessions SET created_at=?,updated_at=? WHERE _id=?',[historical,historical,id(70)]);
    await db.query('UPDATE payment_transactions SET paid_at=?,created_at=?,updated_at=? WHERE _id=?',[historical,historical,historical,id(80)]);
  const repository = new DashboardMetricsRepository({
      $queryRaw: (sql) => db.query(sql.sql, sql.values),
      $transaction: (queries) => Promise.all(queries),
    });
    const filters = {
      start: new Date(now.getTime() - 3 * 86400000).toISOString(),
      end: now.toISOString(),
    };
    const before = await repository.read(office, client, filters);
    const b = before.currencies.find(c=>c.currency==='BRL');
    assert.equal(before.currencies.length,2);
    assert.equal(before.currencies.find(c=>c.currency==='USD').received,500);
    assert.equal(before.currencies.find(c=>c.currency==='USD').newCustomers,1);
    assert.equal(b.newCustomers,0);assert.equal(b.returningCustomers,1);
    assert.equal(b.cardAttempts,2);assert.equal(b.cardApproved,1);assert.equal(b.pixPayments,1);
    assert.equal(b.received, 14000);
    assert.equal(b.paidOrders, 2);
    assert.equal(b.startedOrders, 4);
    assert.equal(b.completedOrders, 1);
    assert.equal(b.abandonedOrders, 1);
    assert.equal(b.abandonedAmount, 2000);
    assert.equal(b.refunded, 1000);
    assert.equal(b.mrr, 16000);
    assert.equal(before.products[0].quantity, 2);
    await payment(24, 11, 1000);
    const after = await repository.read(office, client, filters);
    const a = after.currencies.find(c=>c.currency==='BRL');
    assert.equal(a.received, 15000);
    assert.equal(a.paidOrders, 2);
    assert.equal(a.completedOrders, 2);
    console.log(
      'PASS: mixed purchase deduplication, incomplete purchase, tenant isolation, pending charge exclusion, abandonment, partial refunds, MRR and products.',
    );
  } finally {
    await db.end();
  }
})().catch((e) => {
  console.error(e.message);
  process.exitCode = 1;
});
