import { Module } from '@nestjs/common';
import { UseCaseSupportModule } from '../../common/services/use-case-support/use-case-support.module';
import { SecurityModule } from '../../modules/security/security.module';
import { SubscriptionPlansModule } from '../../modules/subscription-plans/subscription-plans.module';
import { SubscriptionsModule } from '../../modules/subscriptions/subscriptions.module';
import { RegisterSubscriptionController } from './register-subscription.controller';
import { RegisterSubscriptionUseCase } from './register-subscription.use-case';

@Module({
  imports: [
    SubscriptionPlansModule,
    SubscriptionsModule,
    SecurityModule,
    UseCaseSupportModule,
  ],
  controllers: [RegisterSubscriptionController],
  providers: [RegisterSubscriptionUseCase],
  exports: [RegisterSubscriptionUseCase],
})
export class RegisterSubscriptionModule {}