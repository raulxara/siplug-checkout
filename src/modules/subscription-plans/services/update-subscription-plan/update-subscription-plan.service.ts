import { Inject, Injectable } from '@nestjs/common';

import { BuildChangesHistoryService } from '../../../../common/services/changes-history/build-changes-history.service';
import type { ISubscriptionPlansRepository } from '../../entities/subscription-plans-repository.interface';
import { SUBSCRIPTION_PLANS_REPOSITORY } from '../../tokens/subscription-plans.tokens';
import { UpdateSubscriptionPlanDtoIn } from './dtos/update-subscription-plan.dto-in';
import { UpdateSubscriptionPlanDtoOut } from './dtos/update-subscription-plan.dto-out';

@Injectable()
export class UpdateSubscriptionPlanService {
  constructor(
    @Inject(SUBSCRIPTION_PLANS_REPOSITORY)
    private readonly subscriptionPlansRepository: ISubscriptionPlansRepository,

    private readonly buildChangesHistoryService: BuildChangesHistoryService,
  ) {}

  async exec(
    dtoIn: UpdateSubscriptionPlanDtoIn,
  ): Promise<UpdateSubscriptionPlanDtoOut> {
    const current = await this.subscriptionPlansRepository.findByUniqueId(
      dtoIn._id,
    );

    if (current === null) {
      throw new Error('subscription plan not found');
    }

    const newDataForHistory = this.buildNewDataForHistory(dtoIn);

    const changesHistory = this.buildChangesHistoryService.exec({
      currentChangesHistory: current.changesHistory ?? null,
      oldData: current as unknown as Record<string, unknown>,
      newData: newDataForHistory,
      source: dtoIn.source,
    });

    const updated = await this.subscriptionPlansRepository.updateByUniqueId(
      dtoIn._id,
      {
        office_id: dtoIn.officeId,
        client_id: dtoIn.clientId,
        gateway_id: dtoIn.gatewayId,
        api_credential_id: dtoIn.apiCredentialId,

        name: dtoIn.name,
        slug: dtoIn.slug,
        description: dtoIn.description,

        billing_interval: dtoIn.billingInterval,
        billing_interval_count: dtoIn.billingIntervalCount,

        amount: dtoIn.amount,
        currency: dtoIn.currency,

        trial_days: dtoIn.trialDays,
        max_billing_cycles: dtoIn.maxBillingCycles,

        gateway_plan_id: dtoIn.gatewayPlanId,
        payment_methods: dtoIn.paymentMethods,

        metadata: dtoIn.metadata,
        config: dtoIn.config,

        status: dtoIn.status,
        changes_history: changesHistory,
      },
    );

    return new UpdateSubscriptionPlanDtoOut(
      updated as unknown as Record<string, unknown>,
    );
  }

  private buildNewDataForHistory(
    dtoIn: UpdateSubscriptionPlanDtoIn,
  ): Record<string, unknown> {
    const newData: Record<string, unknown> = {};

    this.addIfNotNull(newData, 'officeId', dtoIn.officeId);
    this.addIfNotNull(newData, 'clientId', dtoIn.clientId);
    this.addIfNotNull(newData, 'gatewayId', dtoIn.gatewayId);
    this.addIfNotNull(newData, 'apiCredentialId', dtoIn.apiCredentialId);

    this.addIfNotNull(newData, 'name', dtoIn.name);
    this.addIfNotNull(newData, 'slug', dtoIn.slug);
    this.addIfNotNull(newData, 'description', dtoIn.description);

    this.addIfNotNull(newData, 'billingInterval', dtoIn.billingInterval);
    this.addIfNotNull(
      newData,
      'billingIntervalCount',
      dtoIn.billingIntervalCount,
    );

    this.addIfNotNull(newData, 'amount', dtoIn.amount);
    this.addIfNotNull(newData, 'currency', dtoIn.currency);

    this.addIfNotNull(newData, 'trialDays', dtoIn.trialDays);
    this.addIfNotNull(newData, 'maxBillingCycles', dtoIn.maxBillingCycles);

    this.addIfNotNull(newData, 'gatewayPlanId', dtoIn.gatewayPlanId);
    this.addIfNotNull(newData, 'paymentMethods', dtoIn.paymentMethods);

    this.addIfNotNull(newData, 'metadata', dtoIn.metadata);
    this.addIfNotNull(newData, 'config', dtoIn.config);

    this.addIfNotNull(newData, 'status', dtoIn.status);

    return newData;
  }

  private addIfNotNull(
    target: Record<string, unknown>,
    key: string,
    value: unknown,
  ): void {
    if (value !== null && value !== undefined) {
      target[key] = value;
    }
  }
}
