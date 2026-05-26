import { Module } from '@nestjs/common';
import { UseCaseSupportModule } from '../../common/services/use-case-support/use-case-support.module';
import { CheckoutSessionsModule } from '../../modules/checkout-sessions/checkout-sessions.module';
import { OfficesModule } from '../../modules/offices/offices.module';
import { SecurityModule } from '../../modules/security/security.module';
import { GetCheckoutSessionByUniqueIdController } from './get-checkout-session-by-unique-id.controller';
import { GetCheckoutSessionByUniqueIdUseCase } from './get-checkout-session-by-unique-id.use-case';

@Module({
  imports: [
    OfficesModule,
    CheckoutSessionsModule,
    SecurityModule,
    UseCaseSupportModule,
  ],
  controllers: [GetCheckoutSessionByUniqueIdController],
  providers: [GetCheckoutSessionByUniqueIdUseCase],
  exports: [GetCheckoutSessionByUniqueIdUseCase],
})
export class GetCheckoutSessionByUniqueIdModule {}