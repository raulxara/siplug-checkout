import { Injectable } from '@nestjs/common';

import { GetAllSubscriptionPlansByOfficeIdDtoIn } from '../../modules/subscription-plans/services/get-all-subscription-plans-by-office-id/dtos/get-all-subscription-plans-by-office-id.dto-in';
import { GetAllSubscriptionPlansByOfficeIdService } from '../../modules/subscription-plans/services/get-all-subscription-plans-by-office-id/get-all-subscription-plans-by-office-id.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';

import { ListSubscriptionPlansByOfficeIdDtoIn } from './dtos/list-subscription-plans-by-office-id.dto-in';
import { ListSubscriptionPlansByOfficeIdDtoOut } from './dtos/list-subscription-plans-by-office-id.dto-out';

@Injectable()
export class ListSubscriptionPlansByOfficeIdUseCase {
  constructor(
    private readonly getAllSubscriptionPlansByOfficeIdService: GetAllSubscriptionPlansByOfficeIdService,
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,
  ) {}

  async exec(
    dtoIn: ListSubscriptionPlansByOfficeIdDtoIn,
  ): Promise<ListSubscriptionPlansByOfficeIdDtoOut> {
    await this.resolveActorAuthorizationService.exec({
      token: dtoIn.token,
      requiredEntity: 'subscription_plans',
      requiredAction: 'listSubscriptionPlansByOfficeId',
    });

    const subscriptionPlansDtoOut =
      await this.getAllSubscriptionPlansByOfficeIdService.exec(
        new GetAllSubscriptionPlansByOfficeIdDtoIn(dtoIn.officeId),
      );

    return new ListSubscriptionPlansByOfficeIdDtoOut(
      subscriptionPlansDtoOut.subscriptionPlans as unknown as Array<
        Record<string, unknown>
      >,
    );
  }
}
