import { Injectable } from '@nestjs/common';

import { FindSubscriptionByUniqueIdDtoIn } from '../../modules/subscriptions/services/find-subscription-by-unique-id/dtos/find-subscription-by-unique-id.dto-in';
import { FindSubscriptionByUniqueIdService } from '../../modules/subscriptions/services/find-subscription-by-unique-id/find-subscription-by-unique-id.service';
import { UpdateSubscriptionDtoIn as UpdateSubscriptionServiceDtoIn } from '../../modules/subscriptions/services/update-subscription/dtos/update-subscription.dto-in';
import { UpdateSubscriptionService } from '../../modules/subscriptions/services/update-subscription/update-subscription.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';

import { UpdateSubscriptionDtoIn } from './dtos/update-subscription.dto-in';
import { UpdateSubscriptionDtoOut } from './dtos/update-subscription.dto-out';

@Injectable()
export class UpdateSubscriptionUseCase {
  constructor(
    private readonly findSubscriptionByUniqueIdService: FindSubscriptionByUniqueIdService,
    private readonly updateSubscriptionService: UpdateSubscriptionService,
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,
  ) {}

  async exec(dtoIn: UpdateSubscriptionDtoIn): Promise<UpdateSubscriptionDtoOut> {
    await this.resolveActorAuthorizationService.exec({
      token: dtoIn.token,
      requiredEntity: 'subscriptions',
      requiredAction: 'updateSubscription',
    });

    await this.findSubscriptionByUniqueIdService.exec(
      new FindSubscriptionByUniqueIdDtoIn(dtoIn.subscriptionId),
    );

    const updatedSubscriptionDtoOut =
      await this.updateSubscriptionService.exec(
        new UpdateSubscriptionServiceDtoIn(
          dtoIn.subscriptionId,

          dtoIn.currentCycle,
          dtoIn.nextBillingAt,
          dtoIn.startedAt,
          dtoIn.canceledAt,
          dtoIn.endedAt,

          dtoIn.metadata,
          dtoIn.config,

          dtoIn.status,
          'UpdateSubscriptionUseCase',

          dtoIn.gatewaySubscriptionId,
        ),
      );

    return new UpdateSubscriptionDtoOut(
      updatedSubscriptionDtoOut.subscription as unknown as Record<
        string,
        unknown
      >,
    );
  }
}
