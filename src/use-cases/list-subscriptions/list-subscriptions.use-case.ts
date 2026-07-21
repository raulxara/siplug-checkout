import { Injectable } from '@nestjs/common';

import { GetAllSubscriptionsService } from '../../modules/subscriptions/services/get-all-subscriptions/get-all-subscriptions.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';

import { ListSubscriptionsDtoIn } from './dtos/list-subscriptions.dto-in';
import { ListSubscriptionsDtoOut } from './dtos/list-subscriptions.dto-out';

@Injectable()
export class ListSubscriptionsUseCase {
  constructor(
    private readonly getAllSubscriptionsService: GetAllSubscriptionsService,
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,
  ) {}

  async exec(dtoIn: ListSubscriptionsDtoIn): Promise<ListSubscriptionsDtoOut> {
    await this.resolveActorAuthorizationService.exec({
      token: dtoIn.token,
      requiredEntity: 'subscriptions',
      requiredAction: 'listSubscriptions',
    });

    const subscriptionsDtoOut = await this.getAllSubscriptionsService.exec();

    return new ListSubscriptionsDtoOut(
      subscriptionsDtoOut.subscriptions as unknown as Array<
        Record<string, unknown>
      >,
    );
  }
}
