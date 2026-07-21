import { Module } from '@nestjs/common';
import { SubscriptionsRepository } from './repositories/subscriptions.repository';
import { CreateSubscriptionService } from './services/create-subscription/create-subscription.service';
import { FindSubscriptionByExternalReferenceAndOfficeIdService } from './services/find-subscription-by-external-reference-and-office-id/find-subscription-by-external-reference-and-office-id.service';
import { FindSubscriptionByUniqueIdService } from './services/find-subscription-by-unique-id/find-subscription-by-unique-id.service';
import { UpdateSubscriptionService } from './services/update-subscription/update-subscription.service';
import { SUBSCRIPTIONS_REPOSITORY } from './tokens/subscriptions.tokens';
import { GetAllSubscriptionsService } from './services/get-all-subscriptions/get-all-subscriptions.service';
import { GetAllSubscriptionsByOfficeIdService } from './services/get-all-subscriptions-by-office-id/get-all-subscriptions-by-office-id.service';

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
    GetAllSubscriptionsService,
    GetAllSubscriptionsByOfficeIdService,
  ],
  exports: [
    SUBSCRIPTIONS_REPOSITORY,
    CreateSubscriptionService,
    FindSubscriptionByUniqueIdService,
    FindSubscriptionByExternalReferenceAndOfficeIdService,
    UpdateSubscriptionService,
    GetAllSubscriptionsService,
    GetAllSubscriptionsByOfficeIdService,
  ],
})
export class SubscriptionsModule {}