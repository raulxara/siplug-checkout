import { RefundContextException } from './mercado-pago-refund.service';
import { OrderRefundsUseCase } from './order-refunds.use-case';
import { OrderRefundsRepository } from './order-refunds.repository';
import { OrderRefundDto } from './order-refunds.dto';
const input: OrderRefundDto = {
  orderId: 'order',
  paymentId: 'payment',
  requestId: 'refund',
  amount: 400,
};
describe('Order refund safety', () => {
  const actor = { officeId: 'office', clientId: 'client' };
  const payment = {
    unique_id: 'payment',
    amount: 1000,
    currency: 'BRL',
    gateway_transaction_id: '123',
    api_credential: { token: 'secret', provider: 'mercadopago' },
  };
  const refund = {
    unique_id: 'refund',
    office_id: 'office',
    client_id: 'client',
    payment_transaction_id: 'payment',
    amount: 400,
    status: 'created',
    gateway_refund_id: null,
  };
  function setup(existing: object | null = null) {
    let current = existing;
    const db = {
      paymentRefund: {
        findUnique: jest.fn(async () => current),
        findUniqueOrThrow: jest.fn(async () => current),
        updateMany: jest.fn(async ({ data }) => {
          current = { ...current, ...data };
          return { count: 1 };
        }),
        update: jest.fn(async ({ data }) => {
          current = { ...current, ...data };
          return current;
        }),
      },
    };
    const repo = {
      db,
      findRefund: db.paymentRefund.findUnique,
      requireRefund: db.paymentRefund.findUniqueOrThrow,
      claimRefund: (id: string) =>
        db.paymentRefund.updateMany({ data: { status: 'submitted' } }),
      saveRefundResult: async (id: string, state: string, gatewayId?: string) =>
        db.paymentRefund.update({
          data: {
            status: state,
            ...(gatewayId ? { gateway_refund_id: gatewayId } : {}),
          },
        }),
      subscription: jest.fn(),
      completeSubscription: jest.fn(),
      attachRefund: jest.fn(),
      projectConfirmed: jest.fn(),
      pinPaymentContext: jest.fn(),
      payment: jest.fn(async () => payment),
      reserve: jest.fn(async () => {
        current = { ...refund };
        return current;
      }),
    };
    const gateway = {
      preflight: jest.fn().mockResolvedValue({
        paymentId: '123',
        liveMode: true,
        collectorId: 'seller',
      }),
      request: jest.fn(),
      cancelSubscription: jest.fn(),
    };
    const auth = { exec: jest.fn() },
      identity = { exec: jest.fn(async () => actor) };
    const uc = new OrderRefundsUseCase(
      identity as never,
      auth as never,
      repo as never,
      gateway as never,
    );
    return { uc, repo, gateway, db };
  }
  it('never dispatches or freezes a request when credential preflight fails', async () => {
    const { uc, gateway, repo } = setup({ ...refund, status: 'created' });
    gateway.preflight.mockRejectedValue(
      new RefundContextException('REFUND_ENVIRONMENT_MISMATCH'),
    );
    expect((await uc.exec('token', input)).state).toBe('created');
    expect(gateway.request).not.toHaveBeenCalled();
    expect(repo.pinPaymentContext).not.toHaveBeenCalled();
  });
  it('selects full-refund semantics only for the entire original payment', async () => {
    const { uc, gateway } = setup({ ...refund, amount: 1000 });
    gateway.request.mockResolvedValue({
      id: 12,
      payment_id: 123,
      amount: 10,
      status: 'approved',
    });
    expect((await uc.exec('token', { ...input, amount: 1000 })).state).toBe(
      'succeeded',
    );
    expect(gateway.request).toHaveBeenCalledWith(
      'secret',
      '123',
      'POST',
      'refund',
      1000,
      undefined,
      true,
    );
  });
  it('returns confirmed refund without making another gateway request', async () => {
    const { uc, gateway } = setup({ ...refund, status: 'succeeded' });
    expect((await uc.exec('token', input)).state).toBe('succeeded');
    expect(gateway.request).not.toHaveBeenCalled();
  });
  it('rejects an idempotency identifier owned by another tenant', async () => {
    const { uc, gateway } = setup({ ...refund, office_id: 'another' });
    await expect(uc.exec('token', input)).rejects.toThrow('REFUND_KEY_REUSED');
    expect(gateway.request).not.toHaveBeenCalled();
  });
  it('reserves before dispatch and sends the same identifier to the gateway', async () => {
    const { uc, repo, gateway } = setup();
    gateway.request
      .mockResolvedValueOnce({
        id: 123,
        status: 'approved',
        currency_id: 'BRL',
        transaction_amount: 10,
        transaction_amount_refunded: 0,
      })
      .mockResolvedValueOnce({
        id: 12,
        payment_id: 123,
        amount: 4,
        status: 'approved',
      });
    expect((await uc.exec('token', input)).state).toBe('succeeded');
    expect(repo.reserve).toHaveBeenCalledWith(
      'office',
      'client',
      input,
      0,
      '123',
    );
    expect(gateway.request.mock.calls[1]).toEqual([
      'secret',
      '123',
      'POST',
      'refund',
      400,
      undefined,
      false,
    ]);
  });
  it('refunds a legacy Checkout Pro preference through its verified webhook payment ID', async () => {
    const { uc, repo, gateway } = setup();
    repo.payment.mockResolvedValue({
      ...payment,
      gateway_transaction_id: 'merchant-preference',
      provider_response: { latestWebhookPayload: { payment: { id: 123 } } },
      external_reference: 'order',
    } as typeof payment);
    gateway.request
      .mockResolvedValueOnce({
        id: 123,
        external_reference: 'order',
        status: 'approved',
        currency_id: 'BRL',
        transaction_amount: 10,
        transaction_amount_refunded: 0,
      })
      .mockResolvedValueOnce({
        id: 12,
        payment_id: 123,
        amount: 4,
        status: 'approved',
      });
    expect((await uc.exec('token', input)).state).toBe('succeeded');
    expect(gateway.request.mock.calls[1]).toEqual([
      'secret',
      '123',
      'POST',
      'refund',
      400,
      undefined,
      false,
    ]);
    expect(repo.reserve).toHaveBeenCalledWith(
      'office',
      'client',
      input,
      0,
      '123',
    );
  });
  it('rejects a provider payment belonging to another order before reservation', async () => {
    const { uc, repo, gateway } = setup();
    repo.payment.mockResolvedValue({
      ...payment,
      external_reference: 'order',
    } as typeof payment);
    gateway.request.mockResolvedValue({
      id: 123,
      external_reference: 'other',
      status: 'approved',
      currency_id: 'BRL',
      transaction_amount: 10,
    });
    await expect(uc.exec('token', input)).rejects.toThrow(
      'REFUND_PAYMENT_REVIEW',
    );
    expect(repo.reserve).not.toHaveBeenCalled();
    expect(gateway.request).toHaveBeenCalledTimes(1);
  });
  it('retains an unknown result and never dispatches again on retry', async () => {
    const { uc, gateway } = setup({ ...refund, status: 'created' });
    gateway.request.mockRejectedValue(new Error('connection lost'));
    expect((await uc.exec('token', input)).state).toBe(
      'reconciliation_required',
    );
    expect((await uc.exec('token', input)).state).toBe(
      'reconciliation_required',
    );
    expect(gateway.request).toHaveBeenCalledTimes(1);
  });
  it('queries the known refund instead of repeating a pending POST', async () => {
    const { uc, gateway } = setup({
      ...refund,
      status: 'processing',
      gateway_refund_id: '12',
    });
    gateway.request.mockResolvedValue({
      id: 12,
      payment_id: 123,
      amount: 4,
      status: 'approved',
    });
    await uc.exec('token', input);
    expect(gateway.request).toHaveBeenCalledWith(
      'secret',
      '123',
      'GET',
      undefined,
      undefined,
      '12',
    );
  });
  it('does not confirm a mismatched provider amount', async () => {
    const { uc, gateway } = setup({ ...refund, status: 'created' });
    gateway.request.mockResolvedValue({
      id: 12,
      payment_id: 123,
      amount: 9,
      status: 'approved',
    });
    expect((await uc.exec('token', input)).state).toBe(
      'reconciliation_required',
    );
  });
  it('does not send a refund for a payment disputed at the gateway', async () => {
    const { uc, repo, gateway } = setup();
    gateway.request.mockResolvedValue({
      status: 'charged_back',
      currency_id: 'BRL',
      transaction_amount: 10,
    });
    await expect(uc.exec('token', input)).rejects.toThrow(
      'REFUND_PAYMENT_REVIEW',
    );
    expect(repo.reserve).not.toHaveBeenCalled();
  });
  it('locks the payment and rejects a refund exceeding remaining funds', async () => {
    const tx = {
      $queryRaw: jest.fn(),
      paymentRefund: {
        findUnique: jest.fn(async () => null),
        findMany: jest.fn(async () => [{ status: 'succeeded', amount: 800 }]),
        create: jest.fn(),
      },
      paymentTransaction: {
        findFirst: jest.fn(async () => ({
          status: 'paid',
          amount: 1000,
          currency: 'BRL',
        })),
      },
    };
    const db = {
      $transaction: async (fn: (t: typeof tx) => unknown) => fn(tx),
    };
    const r = new OrderRefundsRepository(db as never);
    await expect(r.reserve('office', 'client', input, 0)).rejects.toThrow(
      'REFUND_AMOUNT_EXCEEDED',
    );
    expect(tx.$queryRaw).toHaveBeenCalled();
    expect(tx.paymentRefund.create).not.toHaveBeenCalled();
  });
  it("rejects reconciliation with another payment's gateway refund", async () => {
    const { uc, repo, gateway } = setup({
      ...refund,
      status: 'reconciliation_required',
      created_at: new Date(),
    });
    gateway.request.mockResolvedValue({
      id: 12,
      payment_id: 999,
      amount: 4,
      date_created: new Date().toISOString(),
      status: 'approved',
    });
    await expect(
      uc.reconcile('token', { ...input, gatewayRefundId: '12' }),
    ).rejects.toThrow('REFUND_RECONCILIATION_MISMATCH');
    expect(repo.attachRefund).not.toHaveBeenCalled();
  });
  it('does not cancel local access when gateway cancellation fails', async () => {
    const { uc, repo, gateway } = setup();
    repo.subscription.mockResolvedValue({
      unique_id: 'sub',
      gateway_subscription_id: 'remote',
      external_reference: 'ref',
      api_credential: {
        office_id: 'office',
        client_id: 'client',
        status: 'active',
        provider: 'mercado_pago',
        token: 'secret',
      },
    });
    gateway.cancelSubscription.mockRejectedValue(new Error('unavailable'));
    await expect(
      uc.cancelSubscription('token', {
        orderId: 'order',
        subscriptionId: 'sub',
        access: 'immediate',
      }),
    ).rejects.toThrow('unavailable');
    expect(repo.completeSubscription).not.toHaveBeenCalled();
  });
  it('preserves paid-period choice after verified subscription cancellation', async () => {
    const { uc, repo, gateway } = setup();
    repo.subscription.mockResolvedValue({
      unique_id: 'sub',
      gateway_subscription_id: 'remote',
      external_reference: 'ref',
      api_credential: {
        office_id: 'office',
        client_id: 'client',
        status: 'active',
        provider: 'mercado_pago',
        token: 'secret',
      },
    });
    await uc.cancelSubscription('token', {
      orderId: 'order',
      subscriptionId: 'sub',
      access: 'paid_period',
    });
    expect(gateway.cancelSubscription).toHaveBeenCalledWith(
      'secret',
      'remote',
      'ref',
    );
    expect(repo.completeSubscription).toHaveBeenCalledWith(
      'office',
      'client',
      'sub',
      false,
    );
  });
});

describe('Refund credential provider aliases', () => {
  const credential = {
    office_id: 'office',
    client_id: 'client',
    status: 'active',
    token: 'test-secret',
  };
  it.each(['mercado_pago', 'mercadopago', 'mercado-pago'])(
    'lists and validates %s payments consistently',
    async (provider) => {
      const payment = {
        unique_id: 'payment',
        amount: 1000,
        status: 'paid',
        currency: 'BRL',
        has_split: false,
        split_required: false,
        api_credential: { ...credential, provider },
        refunds: [],
      };
      const db = {
        paymentTransaction: {
          findMany: jest.fn().mockResolvedValue([payment]),
          findFirst: jest.fn().mockResolvedValue(payment),
        },
      };
      const repo = new OrderRefundsRepository(db as never);
      const gateway = { request: jest.fn() };
      const uc = new OrderRefundsUseCase(
        {
          exec: jest
            .fn()
            .mockResolvedValue({ officeId: 'office', clientId: 'client' }),
        } as never,
        { exec: jest.fn() } as never,
        repo,
        gateway as never,
      );
      expect((await uc.list('token', 'order')).items[0].supported).toBe(true);
      expect(await repo.payment('office', 'client', input)).toBe(payment);
      expect(gateway.request).not.toHaveBeenCalled();
    },
  );
  it.each([
    { provider: 'other', status: 'active', office_id: 'office', split: false },
    {
      provider: 'mercadopago',
      status: 'inactive',
      office_id: 'office',
      split: false,
    },
    {
      provider: 'mercadopago',
      status: 'active',
      office_id: 'other-office',
      split: false,
    },
    {
      provider: 'mercadopago',
      status: 'active',
      office_id: 'office',
      split: true,
    },
  ])(
    'still rejects unsupported or unsafe credentials: %j',
    async ({ provider, status, office_id, split }) => {
      const repo = new OrderRefundsRepository({
        paymentTransaction: {
          findFirst: jest.fn().mockResolvedValue({
            has_split: split,
            api_credential: { ...credential, provider, status, office_id },
          }),
        },
      } as never);
      await expect(repo.payment('office', 'client', input)).rejects.toThrow();
    },
  );
});

describe('Refund failure persistence', () => {
  it('preserves the original payment binding while recording a provider refusal', async () => {
    let current: any = {
      unique_id: 'refund',
      status: 'submitted',
      metadata: { gatewayPaymentId: '123', orderId: 'order' },
    };
    const db = {
      paymentRefund: {
        findUniqueOrThrow: jest.fn(async () => current),
        updateMany: jest.fn(async ({ data }) => {
          current = { ...current, ...data };
          return { count: 1 };
        }),
      },
    };
    const repo = new OrderRefundsRepository(db as never);
    const failure = {
      code: 'gateway_rejected_request',
      upstreamStatus: 404,
      providerCode: 'not_found',
      at: new Date().toISOString(),
    };
    const result = await repo.saveRefundResult(
      'refund',
      'reconciliation_required',
      undefined,
      failure,
    );
    expect(result.metadata).toEqual({
      gatewayPaymentId: '123',
      orderId: 'order',
      lastFailure: failure,
    });
    await repo.saveRefundResult('refund', 'succeeded', '77');
    expect(current.metadata).toEqual({
      gatewayPaymentId: '123',
      orderId: 'order',
    });
  });
});
