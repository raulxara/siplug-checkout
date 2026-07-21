import { Injectable } from '@nestjs/common';

import { FindSubscriptionPlanByUniqueIdDtoIn } from '../../modules/subscription-plans/services/find-subscription-plan-by-unique-id/dtos/find-subscription-plan-by-unique-id.dto-in';
import { FindSubscriptionPlanByUniqueIdService } from '../../modules/subscription-plans/services/find-subscription-plan-by-unique-id/find-subscription-plan-by-unique-id.service';
import { UpdateSubscriptionPlanDtoIn as UpdateSubscriptionPlanServiceDtoIn } from '../../modules/subscription-plans/services/update-subscription-plan/dtos/update-subscription-plan.dto-in';
import { UpdateSubscriptionPlanService } from '../../modules/subscription-plans/services/update-subscription-plan/update-subscription-plan.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';

import { UpdateSubscriptionPlanDtoIn } from './dtos/update-subscription-plan.dto-in';
import { UpdateSubscriptionPlanDtoOut } from './dtos/update-subscription-plan.dto-out';

@Injectable()
export class UpdateSubscriptionPlanUseCase {
  constructor(
    private readonly findSubscriptionPlanByUniqueIdService: FindSubscriptionPlanByUniqueIdService,
    private readonly updateSubscriptionPlanService: UpdateSubscriptionPlanService,
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,
  ) {}

  async exec(
    dtoIn: UpdateSubscriptionPlanDtoIn,
  ): Promise<UpdateSubscriptionPlanDtoOut> {
    const currentSubscriptionPlanDtoOut =
      await this.findSubscriptionPlanByUniqueIdService.exec(
        new FindSubscriptionPlanByUniqueIdDtoIn(dtoIn.subscriptionPlanId),
      );

    await this.resolveActorAuthorizationService.exec({
      token: dtoIn.token,
      requiredEntity: 'subscription_plans',
      requiredAction: 'updateSubscriptionPlan',
    });

    const updatedSubscriptionPlanDtoOut =
      await this.updateSubscriptionPlanService.exec(
        new UpdateSubscriptionPlanServiceDtoIn({
          _id: dtoIn.subscriptionPlanId,

          officeId: dtoIn.officeId,
          clientId: dtoIn.clientId,
          gatewayId: dtoIn.gatewayId,
          apiCredentialId: dtoIn.apiCredentialId,

          name: dtoIn.name,
          slug: dtoIn.slug,
          description: dtoIn.description,

          billingInterval: dtoIn.billingInterval,
          billingIntervalCount: dtoIn.billingIntervalCount,

          amount: dtoIn.amount,
          currency: dtoIn.currency,

          trialDays: dtoIn.trialDays,
          maxBillingCycles: dtoIn.maxBillingCycles,

          gatewayPlanId: dtoIn.gatewayPlanId,
          paymentMethods: dtoIn.paymentMethods,

          metadata: dtoIn.metadata,
          config: dtoIn.config,

          status: dtoIn.status,

          source: 'UpdateSubscriptionPlanUseCase',
        }),
      );

    return new UpdateSubscriptionPlanDtoOut(
      updatedSubscriptionPlanDtoOut.subscriptionPlan as unknown as Record<
        string,
        unknown
      >,
    );
  }
}
