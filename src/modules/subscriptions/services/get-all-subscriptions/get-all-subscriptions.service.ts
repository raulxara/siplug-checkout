import { Inject, Injectable } from '@nestjs/common';

import type { ISubscriptionsRepository } from '../../entities/subscriptions-repository.interface';
import { SUBSCRIPTIONS_REPOSITORY } from '../../tokens/subscriptions.tokens';
import { GetAllSubscriptionsDtoOut } from './dtos/get-all-subscriptions.dto-out';

@Injectable()
export class GetAllSubscriptionsService {
  constructor(
    @Inject(SUBSCRIPTIONS_REPOSITORY)
    private readonly subscriptionsRepository: ISubscriptionsRepository,
  ) {}

  async exec(): Promise<GetAllSubscriptionsDtoOut> {
    const subscriptions = await this.subscriptionsRepository.getAll();

    return new GetAllSubscriptionsDtoOut(
      subscriptions as unknown as Array<Record<string, unknown>>,
    );
  }
}
