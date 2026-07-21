import { Inject, Injectable } from '@nestjs/common';
import { SubscriptionPlanEntity } from '../../entities/subscription-plan.entity';
import type {
  ISubscriptionPlansRepository,
  SubscriptionPlanRow,
} from '../../entities/subscription-plans-repository.interface';
import { SUBSCRIPTION_PLANS_REPOSITORY } from '../../tokens/subscription-plans.tokens';
import { CreateSubscriptionPlanDtoIn } from './dtos/create-subscription-plan.dto-in';
import { CreateSubscriptionPlanDtoOut } from './dtos/create-subscription-plan.dto-out';

@Injectable()
export class CreateSubscriptionPlanService {
  constructor(
    @Inject(SUBSCRIPTION_PLANS_REPOSITORY)
    private readonly repository: ISubscriptionPlansRepository,
  ) {}

  async exec(
    dtoIn: CreateSubscriptionPlanDtoIn,
  ): Promise<CreateSubscriptionPlanDtoOut> {
    try {
      const entity = new SubscriptionPlanEntity(this.repository);

      entity.officeId = dtoIn.officeId;
      entity.clientId = dtoIn.clientId;

      entity.gatewayId = dtoIn.gatewayId;
      entity.apiCredentialId = dtoIn.apiCredentialId;
      entity.gatewayPlanId = dtoIn.gatewayPlanId;

      entity.name = dtoIn.name;
      entity.slug = dtoIn.slug;
      entity.description = dtoIn.description;

      entity.billingInterval = dtoIn.billingInterval;
      entity.billingIntervalCount = dtoIn.billingIntervalCount;

      entity.amount = dtoIn.amount;
      entity.currency = dtoIn.currency;

      entity.trialDays = dtoIn.trialDays;
      entity.maxBillingCycles = dtoIn.maxBillingCycles;

      entity.paymentMethods = dtoIn.paymentMethods;
      entity.metadata = dtoIn.metadata;
      entity.config = dtoIn.config;
      entity.status = dtoIn.status;

      const created = await entity.create();

      return new CreateSubscriptionPlanDtoOut(this.toRow(created));
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on create subscription plan';

      throw new Error(message);
    }
  }

  private toRow(entity: SubscriptionPlanEntity): SubscriptionPlanRow {
    return {
      id: this.requiredNumber(entity.id, 'subscription plan id'),
      _id: this.requiredString(entity._id, 'subscription plan _id'),

      officeId: entity.officeId,
      clientId: entity.clientId,

      gatewayId: entity.gatewayId,
      apiCredentialId: entity.apiCredentialId,
      gatewayPlanId: entity.gatewayPlanId,

      name: entity.name,
      slug: entity.slug,
      description: entity.description,

      billingInterval: entity.billingInterval,
      billingIntervalCount: entity.billingIntervalCount,

      amount: entity.amount,
      currency: entity.currency,

      trialDays: entity.trialDays,
      maxBillingCycles: entity.maxBillingCycles,

      paymentMethods: entity.paymentMethods,
      metadata: entity.metadata,
      config: entity.config,
      changesHistory: entity.changesHistory,

      status: this.requiredString(entity.status, 'subscription plan status'),

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
