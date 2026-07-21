import { Injectable } from '@nestjs/common';

import { FindSubscriptionPlanByUniqueIdDtoIn } from '../../modules/subscription-plans/services/find-subscription-plan-by-unique-id/dtos/find-subscription-plan-by-unique-id.dto-in';
import { FindSubscriptionPlanByUniqueIdService } from '../../modules/subscription-plans/services/find-subscription-plan-by-unique-id/find-subscription-plan-by-unique-id.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';

import { GetSubscriptionPlanByUniqueIdDtoIn } from './dtos/get-subscription-plan-by-unique-id.dto-in';
import { GetSubscriptionPlanByUniqueIdDtoOut } from './dtos/get-subscription-plan-by-unique-id.dto-out';

@Injectable()
export class GetSubscriptionPlanByUniqueIdUseCase {
  constructor(
    private readonly findSubscriptionPlanByUniqueIdService: FindSubscriptionPlanByUniqueIdService,
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,
  ) {}

  async exec(
    dtoIn: GetSubscriptionPlanByUniqueIdDtoIn,
  ): Promise<GetSubscriptionPlanByUniqueIdDtoOut> {
    const subscriptionPlanDtoOut =
      await this.findSubscriptionPlanByUniqueIdService.exec(
        new FindSubscriptionPlanByUniqueIdDtoIn(dtoIn.subscriptionPlanId),
      );

    const subscriptionPlan = subscriptionPlanDtoOut.subscriptionPlan;

    await this.resolveActorAuthorizationService.exec({
      token: dtoIn.token,
      requiredEntity: 'subscription_plans',
      requiredAction: 'getSubscriptionPlanByUniqueId',
    });

    return new GetSubscriptionPlanByUniqueIdDtoOut(
      subscriptionPlan as unknown as Record<string, unknown>,
    );
  }
}
