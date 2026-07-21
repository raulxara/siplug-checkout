import { Inject, Injectable } from '@nestjs/common';
import { SubscriptionEntity } from '../../entities/subscription.entity';
import type {
  ISubscriptionsRepository,
  SubscriptionRow,
} from '../../entities/subscriptions-repository.interface';
import { SUBSCRIPTIONS_REPOSITORY } from '../../tokens/subscriptions.tokens';
import { CreateSubscriptionDtoIn } from './dtos/create-subscription.dto-in';
import { CreateSubscriptionDtoOut } from './dtos/create-subscription.dto-out';

@Injectable()
export class CreateSubscriptionService {
  constructor(
    @Inject(SUBSCRIPTIONS_REPOSITORY)
    private readonly repository: ISubscriptionsRepository,
  ) {}

  async exec(
    dtoIn: CreateSubscriptionDtoIn,
  ): Promise<CreateSubscriptionDtoOut> {
    try {
      const entity = new SubscriptionEntity(this.repository);

      entity.officeId = dtoIn.officeId;
      entity.clientId = dtoIn.clientId;

      entity.subscriptionPlanId = dtoIn.subscriptionPlanId;
      entity.paymentCustomerId = dtoIn.paymentCustomerId;

      entity.gatewayId = dtoIn.gatewayId;
      entity.apiCredentialId = dtoIn.apiCredentialId;

      entity.gatewaySubscriptionId = dtoIn.gatewaySubscriptionId;
      entity.externalReference = dtoIn.externalReference;

      entity.amount = dtoIn.amount;
      entity.currency = dtoIn.currency;

      entity.currentCycle = dtoIn.currentCycle;

      entity.nextBillingAt = dtoIn.nextBillingAt;
      entity.startedAt = dtoIn.startedAt;
      entity.canceledAt = dtoIn.canceledAt;
      entity.endedAt = dtoIn.endedAt;

      entity.metadata = dtoIn.metadata;
      entity.config = dtoIn.config;
      entity.status = dtoIn.status;

      const created = await entity.create();

      return new CreateSubscriptionDtoOut(this.toRow(created));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'error on create subscription';

      throw new Error(message);
    }
  }

  private toRow(entity: SubscriptionEntity): SubscriptionRow {
    return {
      id: this.requiredNumber(entity.id, 'subscription id'),
      _id: this.requiredString(entity._id, 'subscription _id'),

      officeId: entity.officeId,
      clientId: entity.clientId,

      subscriptionPlanId: entity.subscriptionPlanId,
      paymentCustomerId: entity.paymentCustomerId,

      gatewayId: entity.gatewayId,
      apiCredentialId: entity.apiCredentialId,

      gatewaySubscriptionId: entity.gatewaySubscriptionId,
      externalReference: entity.externalReference,

      amount: entity.amount,
      currency: entity.currency,

      currentCycle: entity.currentCycle,

      nextBillingAt: entity.nextBillingAt,
      startedAt: entity.startedAt,
      canceledAt: entity.canceledAt,
      endedAt: entity.endedAt,

      metadata: entity.metadata,
      config: entity.config,
      changesHistory: entity.changesHistory,

      status: this.requiredString(entity.status, 'subscription status'),

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