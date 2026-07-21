import { AbstractEntity } from '../../../shared/entities/abstract.entity';
import type { ISubscriptionInvoicesRepository } from './subscription-invoices-repository.interface';

export class SubscriptionInvoiceEntity extends AbstractEntity {
  public subscriptionId!: string;
  public subscriptionCycleId: string | null = null;
  public paymentTransactionId: string | null = null;

  public invoiceNumber: string | null = null;

  public amount!: number;
  public currency!: string;

  public dueAt: string | null = null;
  public paidAt: string | null = null;

  public attemptNumber = 1;
  public externalReference: string | null = null;
  public gatewayInvoiceId: string | null = null;
  public lastAttemptAt: string | null = null;

  public metadata: Record<string, unknown> | null = null;
  public config: Record<string, unknown> | null = null;
  public changesHistory: Array<Record<string, unknown>> | null = null;

  constructor(private readonly repository: ISubscriptionInvoicesRepository) {
    super();
  }

  async create(): Promise<SubscriptionInvoiceEntity> {
    const fresh = await this.repository.create(this);

    this.hydrate({
      id: fresh.id,
      _id: fresh._id,

      subscriptionId: fresh.subscriptionId,
      subscriptionCycleId: fresh.subscriptionCycleId,
      paymentTransactionId: fresh.paymentTransactionId,

      invoiceNumber: fresh.invoiceNumber,

      amount: fresh.amount,
      currency: fresh.currency,

      dueAt: fresh.dueAt,
      paidAt: fresh.paidAt,

      attemptNumber: fresh.attemptNumber,
      externalReference: fresh.externalReference,
      gatewayInvoiceId: fresh.gatewayInvoiceId,
      lastAttemptAt: fresh.lastAttemptAt,

      metadata: fresh.metadata,
      config: fresh.config,
      changesHistory: fresh.changesHistory,

      status: fresh.status,
      createdAt: fresh.createdAt,
      updatedAt: fresh.updatedAt,
    });

    return this;
  }
}