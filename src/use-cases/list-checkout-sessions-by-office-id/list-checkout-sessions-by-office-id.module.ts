import { Module } from '@nestjs/common';

import { UseCaseSupportModule } from '../../common/services/use-case-support/use-case-support.module';
import { CheckoutSessionsModule } from '../../modules/checkout-sessions/checkout-sessions.module';
import { OfficesModule } from '../../modules/offices/offices.module';
import { SecurityModule } from '../../modules/security/security.module';
import { ListCheckoutSessionsByOfficeIdController } from './list-checkout-sessions-by-office-id.controller';
import { ListCheckoutSessionsByOfficeIdUseCase } from './list-checkout-sessions-by-office-id.use-case';

@Module({
  imports: [
    CheckoutSessionsModule,
    OfficesModule,
    SecurityModule,
    UseCaseSupportModule,
  ],
  controllers: [ListCheckoutSessionsByOfficeIdController],
  providers: [ListCheckoutSessionsByOfficeIdUseCase],
  exports: [ListCheckoutSessionsByOfficeIdUseCase],
})
export class ListCheckoutSessionsByOfficeIdModule {}
