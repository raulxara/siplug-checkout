import { Injectable } from '@nestjs/common';

import { GetAllSubscriptionPlansService } from '../../modules/subscription-plans/services/get-all-subscription-plans/get-all-subscription-plans.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';

import { ListSubscriptionPlansDtoIn } from './dtos/list-subscription-plans.dto-in';
import { ListSubscriptionPlansDtoOut } from './dtos/list-subscription-plans.dto-out';

@Injectable()
export class ListSubscriptionPlansUseCase {
  constructor(
    private readonly getAllSubscriptionPlansService: GetAllSubscriptionPlansService,
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,
  ) {}

  async exec(
    dtoIn: ListSubscriptionPlansDtoIn,
  ): Promise<ListSubscriptionPlansDtoOut> {
    await this.resolveActorAuthorizationService.exec({
      token: dtoIn.token,
      requiredEntity: 'subscription_plans',
      requiredAction: 'listSubscriptionPlans',
    });

    const subscriptionPlansDtoOut =
      await this.getAllSubscriptionPlansService.exec();

    return new ListSubscriptionPlansDtoOut(
      subscriptionPlansDtoOut.subscriptionPlans as unknown as Array<
        Record<string, unknown>
      >,
    );
  }
}
