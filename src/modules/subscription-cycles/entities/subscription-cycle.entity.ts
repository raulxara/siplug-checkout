import { AbstractEntity } from '../../../shared/entities/abstract.entity';
import type { ISubscriptionCyclesRepository } from './subscription-cycles-repository.interface';

export class SubscriptionCycleEntity extends AbstractEntity {
  public subscriptionId!: string;
  public cycleNumber!: number;

  public amount!: number;
  public currency!: string;

  public periodStart: string | null = null;
  public periodEnd: string | null = null;
  public scheduledAt: string | null = null;
  public processedAt: string | null = null;

  public metadata: Record<string, unknown> | null = null;
  public config: Record<string, unknown> | null = null;
  public changesHistory: Array<Record<string, unknown>> | null = null;

  constructor(private readonly repository: ISubscriptionCyclesRepository) {
    super();
  }

  async create(): Promise<SubscriptionCycleEntity> {
    const fresh = await this.repository.create(this);

    this.hydrate({
      id: fresh.id,
      _id: fresh._id,

      subscriptionId: fresh.subscriptionId,
      cycleNumber: fresh.cycleNumber,

      amount: fresh.amount,
      currency: fresh.currency,

      periodStart: fresh.periodStart,
      periodEnd: fresh.periodEnd,
      scheduledAt: fresh.scheduledAt,
      processedAt: fresh.processedAt,

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
