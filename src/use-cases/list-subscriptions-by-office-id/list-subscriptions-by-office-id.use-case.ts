import { Injectable } from '@nestjs/common';

import { GetAllSubscriptionsByOfficeIdDtoIn } from '../../modules/subscriptions/services/get-all-subscriptions-by-office-id/dtos/get-all-subscriptions-by-office-id.dto-in';
import { GetAllSubscriptionsByOfficeIdService } from '../../modules/subscriptions/services/get-all-subscriptions-by-office-id/get-all-subscriptions-by-office-id.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';

import { ListSubscriptionsByOfficeIdDtoIn } from './dtos/list-subscriptions-by-office-id.dto-in';
import { ListSubscriptionsByOfficeIdDtoOut } from './dtos/list-subscriptions-by-office-id.dto-out';

@Injectable()
export class ListSubscriptionsByOfficeIdUseCase {
  constructor(
    private readonly getAllSubscriptionsByOfficeIdService: GetAllSubscriptionsByOfficeIdService,
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,
  ) {}

  async exec(
    dtoIn: ListSubscriptionsByOfficeIdDtoIn,
  ): Promise<ListSubscriptionsByOfficeIdDtoOut> {
    await this.resolveActorAuthorizationService.exec({
      token: dtoIn.token,
      requiredEntity: 'subscriptions',
      requiredAction: 'listSubscriptionsByOfficeId',
    });

    const subscriptionsDtoOut =
      await this.getAllSubscriptionsByOfficeIdService.exec(
        new GetAllSubscriptionsByOfficeIdDtoIn(dtoIn.officeId),
      );

    return new ListSubscriptionsByOfficeIdDtoOut(
      subscriptionsDtoOut.subscriptions as unknown as Array<
        Record<string, unknown>
      >,
    );
  }
}