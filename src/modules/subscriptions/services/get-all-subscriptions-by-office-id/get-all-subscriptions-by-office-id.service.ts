import { Inject, Injectable } from '@nestjs/common';

import type { ISubscriptionsRepository } from '../../entities/subscriptions-repository.interface';
import { SUBSCRIPTIONS_REPOSITORY } from '../../tokens/subscriptions.tokens';
import { GetAllSubscriptionsByOfficeIdDtoIn } from './dtos/get-all-subscriptions-by-office-id.dto-in';
import { GetAllSubscriptionsByOfficeIdDtoOut } from './dtos/get-all-subscriptions-by-office-id.dto-out';

@Injectable()
export class GetAllSubscriptionsByOfficeIdService {
  constructor(
    @Inject(SUBSCRIPTIONS_REPOSITORY)
    private readonly subscriptionsRepository: ISubscriptionsRepository,
  ) {}

  async exec(
    dtoIn: GetAllSubscriptionsByOfficeIdDtoIn,
  ): Promise<GetAllSubscriptionsByOfficeIdDtoOut> {
    const subscriptions = await this.subscriptionsRepository.getAllByOfficeId(
      dtoIn.officeId,
    );

    return new GetAllSubscriptionsByOfficeIdDtoOut(
      subscriptions as unknown as Array<Record<string, unknown>>,
    );
  }
}
