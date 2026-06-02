import { Module } from '@nestjs/common';
import { SubscriptionsRepository } from './repositories/subscriptions.repository';
import { CreateSubscriptionService } from './services/create-subscription/create-subscription.service';
import { FindSubscriptionByExternalReferenceAndOfficeIdService } from './services/find-subscription-by-external-reference-and-office-id/find-subscription-by-external-reference-and-office-id.service';
import { FindSubscriptionByUniqueIdService } from './services/find-subscription-by-unique-id/find-subscription-by-unique-id.service';
import { UpdateSubscriptionService } from './services/update-subscription/update-subscription.service';
import { SUBSCRIPTIONS_REPOSITORY } from './tokens/subscriptions.tokens';

@Module({
  providers: [
    {
      provide: SUBSCRIPTIONS_REPOSITORY,
      useClass: SubscriptionsRepository,
    },
    CreateSubscriptionService,
    FindSubscriptionByUniqueIdService,
    FindSubscriptionByExternalReferenceAndOfficeIdService,
    UpdateSubscriptionService,
  ],
  exports: [
    SUBSCRIPTIONS_REPOSITORY,
    CreateSubscriptionService,
    FindSubscriptionByUniqueIdService,
    FindSubscriptionByExternalReferenceAndOfficeIdService,
    UpdateSubscriptionService,
  ],
})
export class SubscriptionsModule {}