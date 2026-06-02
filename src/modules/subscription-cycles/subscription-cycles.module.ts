import { Module } from '@nestjs/common';
import { SubscriptionCyclesRepository } from './repositories/subscription-cycles.repository';
import { CreateSubscriptionCycleService } from './services/create-subscription-cycle/create-subscription-cycle.service';
import { SUBSCRIPTION_CYCLES_REPOSITORY } from './tokens/subscription-cycles.tokens';

@Module({
  providers: [
    {
      provide: SUBSCRIPTION_CYCLES_REPOSITORY,
      useClass: SubscriptionCyclesRepository,
    },
    CreateSubscriptionCycleService,
  ],
  exports: [
    SUBSCRIPTION_CYCLES_REPOSITORY,
    CreateSubscriptionCycleService,
  ],
})
export class SubscriptionCyclesModule {}