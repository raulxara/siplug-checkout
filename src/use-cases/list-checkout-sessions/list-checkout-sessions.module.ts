import { Module } from '@nestjs/common';
import { UseCaseSupportModule } from '../../common/services/use-case-support/use-case-support.module';
import { CheckoutSessionsModule } from '../../modules/checkout-sessions/checkout-sessions.module';
import { OfficesModule } from '../../modules/offices/offices.module';
import { SecurityModule } from '../../modules/security/security.module';
import { ListCheckoutSessionsController } from './list-checkout-sessions.controller';
import { ListCheckoutSessionsUseCase } from './list-checkout-sessions.use-case';

@Module({
  imports: [
    OfficesModule,
    CheckoutSessionsModule,
    SecurityModule,
    UseCaseSupportModule,
  ],
  controllers: [ListCheckoutSessionsController],
  providers: [ListCheckoutSessionsUseCase],
  exports: [ListCheckoutSessionsUseCase],
})
export class ListCheckoutSessionsModule {}