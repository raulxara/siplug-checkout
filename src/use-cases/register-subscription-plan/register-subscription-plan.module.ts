import { Module } from '@nestjs/common';
import { UseCaseSupportModule } from '../../common/services/use-case-support/use-case-support.module';
import { ClientsModule } from '../../modules/clients/clients.module';
import { OfficesModule } from '../../modules/offices/offices.module';
import { SecurityModule } from '../../modules/security/security.module';
import { SubscriptionPlansModule } from '../../modules/subscription-plans/subscription-plans.module';
import { RegisterSubscriptionPlanController } from './register-subscription-plan.controller';
import { RegisterSubscriptionPlanUseCase } from './register-subscription-plan.use-case';

@Module({
  imports: [
    OfficesModule,
    ClientsModule,
    SubscriptionPlansModule,
    SecurityModule,
    UseCaseSupportModule,
  ],
  controllers: [RegisterSubscriptionPlanController],
  providers: [RegisterSubscriptionPlanUseCase],
  exports: [RegisterSubscriptionPlanUseCase],
})
export class RegisterSubscriptionPlanModule {}
