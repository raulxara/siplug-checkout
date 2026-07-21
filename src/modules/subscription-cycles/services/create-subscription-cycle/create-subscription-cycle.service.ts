import { Inject, Injectable } from '@nestjs/common';
import { SubscriptionCycleEntity } from '../../entities/subscription-cycle.entity';
import type {
  ISubscriptionCyclesRepository,
  SubscriptionCycleRow,
} from '../../entities/subscription-cycles-repository.interface';
import { SUBSCRIPTION_CYCLES_REPOSITORY } from '../../tokens/subscription-cycles.tokens';
import { CreateSubscriptionCycleDtoIn } from './dtos/create-subscription-cycle.dto-in';
import { CreateSubscriptionCycleDtoOut } from './dtos/create-subscription-cycle.dto-out';

@Injectable()
export class CreateSubscriptionCycleService {
  constructor(
    @Inject(SUBSCRIPTION_CYCLES_REPOSITORY)
    private readonly repository: ISubscriptionCyclesRepository,
  ) {}

  async exec(
    dtoIn: CreateSubscriptionCycleDtoIn,
  ): Promise<CreateSubscriptionCycleDtoOut> {
    try {
      const entity = new SubscriptionCycleEntity(this.repository);

      entity.subscriptionId = dtoIn.subscriptionId;
      entity.cycleNumber = dtoIn.cycleNumber;

      entity.amount = dtoIn.amount;
      entity.currency = dtoIn.currency;

      entity.periodStart = dtoIn.periodStart;
      entity.periodEnd = dtoIn.periodEnd;
      entity.scheduledAt = dtoIn.scheduledAt;
      entity.processedAt = dtoIn.processedAt;

      entity.metadata = dtoIn.metadata;
      entity.config = dtoIn.config;
      entity.status = dtoIn.status;

      const created = await entity.create();

      return new CreateSubscriptionCycleDtoOut(this.toRow(created));
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on create subscription cycle';

      throw new Error(message);
    }
  }

  private toRow(entity: SubscriptionCycleEntity): SubscriptionCycleRow {
    return {
      id: this.requiredNumber(entity.id, 'subscription cycle id'),
      _id: this.requiredString(entity._id, 'subscription cycle _id'),

      subscriptionId: entity.subscriptionId,
      cycleNumber: entity.cycleNumber,

      amount: entity.amount,
      currency: entity.currency,

      periodStart: entity.periodStart,
      periodEnd: entity.periodEnd,
      scheduledAt: entity.scheduledAt,
      processedAt: entity.processedAt,

      metadata: entity.metadata,
      config: entity.config,
      changesHistory: entity.changesHistory,

      status: this.requiredString(entity.status, 'subscription cycle status'),

      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  private requiredNumber(value: number | null, field: string): number {
    if (value === null) {
      throw new Error(`${field} was not hydrated`);
    }

    return value;
  }

  private requiredString(value: string | null, field: string): string {
    if (value === null || value.trim() === '') {
      throw new Error(`${field} was not hydrated`);
    }

    return value;
  }
}