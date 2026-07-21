import { Injectable } from '@nestjs/common';

import { FindSubscriptionByUniqueIdDtoIn } from '../../modules/subscriptions/services/find-subscription-by-unique-id/dtos/find-subscription-by-unique-id.dto-in';
import { FindSubscriptionByUniqueIdService } from '../../modules/subscriptions/services/find-subscription-by-unique-id/find-subscription-by-unique-id.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';

import { GetSubscriptionByUniqueIdDtoIn } from './dtos/get-subscription-by-unique-id.dto-in';
import { GetSubscriptionByUniqueIdDtoOut } from './dtos/get-subscription-by-unique-id.dto-out';

@Injectable()
export class GetSubscriptionByUniqueIdUseCase {
  constructor(
    private readonly findSubscriptionByUniqueIdService: FindSubscriptionByUniqueIdService,
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,
  ) {}

  async exec(
    dtoIn: GetSubscriptionByUniqueIdDtoIn,
  ): Promise<GetSubscriptionByUniqueIdDtoOut> {
    await this.resolveActorAuthorizationService.exec({
      token: dtoIn.token,
      requiredEntity: 'subscriptions',
      requiredAction: 'getSubscriptionByUniqueId',
    });

    const subscriptionDtoOut =
      await this.findSubscriptionByUniqueIdService.exec(
        new FindSubscriptionByUniqueIdDtoIn(dtoIn.subscriptionId),
      );

    return new GetSubscriptionByUniqueIdDtoOut(
      subscriptionDtoOut.subscription as unknown as Record<string, unknown>,
    );
  }
}