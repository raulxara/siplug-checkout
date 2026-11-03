import { dueStatus, billingDayStart } from './billing.entity';
import { BillingUseCase } from './billing.use-case';
import { financialStatus, manualActions, paymentLink } from './billing.entity';
import {
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

describe('Billing financial safeguards', () => {
  let service: BillingUseCase, session: any, tx: any, repo: any, payments: any;
  const actor = {
    officeId: 'office',
    clientId: 'client',
    userCustomerId: 'actor',
  };
  beforeEach(() => {
    session = {
      id: 1,
      unique_id: 'invoice',
      office_id: 'office',
      client_id: 'client',
      amount: 1000,
      status: 'draft',
      config: {
        billing: {
          version: 1,
          received: 0,
          dueAt: '2099-12-31T00:00:00Z',
          history: [],
        },
      },
      payment_transactions: [],
      payment_customer: { name: 'Test', email: 'test@example.com' },
    };
    tx = {
      $queryRaw: jest.fn(),
      checkoutSession: {
        findFirst: jest.fn(async () => session),
        findUniqueOrThrow: jest.fn(async () => session),
        update: jest.fn(async ({ data }) => {
          session = { ...session, ...data };
          return session;
        }),
      },
    };
    repo = {
      db: { $transaction: async (fn: any) => fn(tx) },
      detail: jest.fn(async () => session),
    };
    payments = { exec: jest.fn() };
    service = new BillingUseCase(
      { exec: async () => actor } as any,
      { exec: async () => ({}) } as any,
      repo,
      payments,
      {
        gateway: async () => ({
          unique_id: 'cred',
          gateway_id: 'gateway',
          environment: 'production',
          config: {},
        }),
      } as any,
    );
  });
  it('resolves a billing customer only inside the current office and client', async () => {
    const findFirst = jest.fn().mockResolvedValue(null);
    repo.db.paymentCustomer = { findFirst };
    await expect(service.customer('token', 'foreign')).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(findFirst).toHaveBeenCalledWith({
      where: {
        unique_id: 'foreign',
        office_id: 'office',
        client_id: 'client',
        status: 'active',
      },
    });
    findFirst.mockResolvedValue({
      name: 'Buyer',
      email: 'buyer@example.com',
      document_type: 'cpf',
      document_value: '123',
      phone: '5511000000000',
      billing_address: {},
      internal_secret: 'must-not-leak',
    });
    const result = await service.customer('token', 'local');
    expect(result.email).toBe('buyer@example.com');
    expect(result).not.toHaveProperty('internal_secret');
  });
  const receive = (amount = 400, key = 'key') => ({
    kind: 'session',
    id: 'invoice',
    action: 'receive',
    requestKey: key,
    amount,
    reason: 'Transferência confirmada',
    method: 'bank_transfer',
    receivedAt: '2026-01-01T00:00:00Z',
  });
  it('records partial then full payment and does not repeat an idempotent receipt', async () => {
    await service.act('token', receive());
    expect(session.status).toBe('partial');
    await service.act('token', receive());
    expect(session.config.billing.received).toBe(400);
    await service.act('token', receive(600, 'second'));
    expect(session.status).toBe('paid');
    expect(payments.exec).not.toHaveBeenCalled();
  });
  it('rejects excess receipts and conflicting reuse of request keys', async () => {
    await service.act('token', receive());
    await expect(service.act('token', receive(500))).rejects.toBeInstanceOf(
      ConflictException,
    );
    await expect(
      service.act('token', receive(700, 'second')),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
  it('never manually settles or cancels a provider-managed charge', async () => {
    session.payment_transactions = [{ id: 1 }];
    await expect(service.act('token', receive())).rejects.toBeInstanceOf(
      ConflictException,
    );
    await expect(
      service.act('token', {
        kind: 'session',
        id: 'invoice',
        action: 'cancel',
        requestKey: 'cancel',
        reason: 'Test',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(tx.checkoutSession.update).not.toHaveBeenCalled();
  });
  it('cannot access an invoice outside the tenant', async () => {
    tx.checkoutSession.findFirst.mockResolvedValue(null);
    await expect(service.act('token', receive())).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(tx.checkoutSession.findFirst.mock.calls[0][0].where).toMatchObject({
      office_id: 'office',
      client_id: 'client',
    });
  });
  it('keeps the original credential environment on issue', async () => {
    await service.act('token', {
      kind: 'session',
      id: 'invoice',
      action: 'issue',
      requestKey: 'issue',
    });
    expect(session.config.environment).toBe('production');
    expect(session.api_credential_id).toBe('cred');
    expect(payments.exec).toHaveBeenCalledTimes(1);
    await service.act('token', {
      kind: 'session',
      id: 'invoice',
      action: 'issue',
      requestKey: 'issue',
    });
    expect(payments.exec).toHaveBeenCalledTimes(1);
  });
  it('allows retry after failure only when no transaction reached dispatch', async () => {
    payments.exec.mockRejectedValue(new Error('validation'));
    await expect(
      service.act('token', {
        kind: 'session',
        id: 'invoice',
        action: 'issue',
        requestKey: 'issue',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(session.status).toBe('draft');
    expect(session.config.billing.issueStartedAt).toBeUndefined();
    payments.exec.mockResolvedValue({});
    await service.act('token', {
      kind: 'session',
      id: 'invoice',
      action: 'issue',
      requestKey: 'issue',
    });
    expect(payments.exec).toHaveBeenCalledTimes(2);
  });
  it('locks uncertain provider outcomes against a second charge', async () => {
    payments.exec.mockImplementation(async () => {
      session.payment_transactions = [{ id: 9 }];
      throw new Error('timeout');
    });
    await expect(
      service.act('token', {
        kind: 'session',
        id: 'invoice',
        action: 'issue',
        requestKey: 'issue',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(session.config.billing.issueStartedAt).toBeDefined();
    await expect(
      service.act('token', {
        kind: 'session',
        id: 'invoice',
        action: 'issue',
        requestKey: 'second',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(payments.exec).toHaveBeenCalledTimes(1);
  });
  it('keeps refund status despite historic payment confirmation', () => {
    expect(financialStatus('refunded', new Date())).toBe('refunded');
    expect(manualActions(true, true, 'open', 0)).toEqual([]);
    expect(paymentLink('javascript:alert(1)')).toBeNull();
    expect(paymentLink('https://user:secret@example.com')).toBeNull();
  });
});

describe('Billing due dates', () => {
  const now = new Date('2026-11-03T15:00:00Z');
  it('moves unpaid and partially paid invoices into overdue', () => {
    expect(dueStatus('open', '2026-11-02T15:00:00Z', now)).toBe('overdue');
    expect(dueStatus('partial', '2026-11-02T15:00:00Z', now)).toBe('overdue');
  });
  it('keeps a bill open through its entire due day in Brasília', () => {
    const due = '2026-11-03T03:00:00Z';
    expect(dueStatus('open', due, now)).toBe('open');
    expect(
      dueStatus('partial', due, new Date('2026-11-04T02:59:59.999Z')),
    ).toBe('partial');
    expect(dueStatus('open', due, new Date('2026-11-04T03:00:00Z'))).toBe(
      'overdue',
    );
    expect(
      billingDayStart(new Date('2026-11-04T02:00:00Z')).toISOString(),
    ).toBe('2026-11-03T03:00:00.000Z');
  });
  it('keeps future and undated invoices open', () => {
    expect(dueStatus('open', '2026-11-04T15:00:00Z', now)).toBe('open');
    expect(dueStatus('open', null, now)).toBe('open');
  });
  it('never marks settled, refunded or canceled invoices overdue', () => {
    for (const state of ['paid', 'refunded', 'canceled', 'draft'])
      expect(dueStatus(state, '2020-01-01T00:00:00Z', now)).toBe(state);
  });
});

describe('Failed billing issuance', () => {
  it('does not show a failed dispatch as an open or overdue payable invoice', () => {
    expect(financialStatus('failed', null)).toBe('failed');
    expect(dueStatus(financialStatus('failed', null), '2020-01-01')).toBe(
      'failed',
    );
    expect(paymentLink(null)).toBeNull();
    expect(manualActions(true, true, 'failed', 0)).toEqual([]);
    expect(financialStatus('failed', new Date())).toBe('paid');
  });
});
