import { GetAuthContextModule } from '../get-auth-context/get-auth-context.module';
import { OrderReportRepository } from '../../modules/order-report/repositories/order-report.repository';
import { Module } from '@nestjs/common';

import { UseCaseSupportModule } from '../../common/services/use-case-support/use-case-support.module';
import { CheckoutSessionsModule } from '../../modules/checkout-sessions/checkout-sessions.module';
import { OfficesModule } from '../../modules/offices/offices.module';
import { SecurityModule } from '../../modules/security/security.module';
import { ListCheckoutSessionsByOfficeIdController } from './list-checkout-sessions-by-office-id.controller';
import { ListCheckoutSessionsByOfficeIdUseCase } from './list-checkout-sessions-by-office-id.use-case';

@Module({
  imports: [
    GetAuthContextModule,
    CheckoutSessionsModule,
    OfficesModule,
    SecurityModule,
    UseCaseSupportModule,
  ],
  controllers: [ListCheckoutSessionsByOfficeIdController],
  providers: [ListCheckoutSessionsByOfficeIdUseCase, OrderReportRepository],
  exports: [ListCheckoutSessionsByOfficeIdUseCase],
})
export class ListCheckoutSessionsByOfficeIdModule {}
