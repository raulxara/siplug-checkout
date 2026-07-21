import { Module } from '@nestjs/common';

import { UseCaseSupportModule } from '../../common/services/use-case-support/use-case-support.module';
import { OfficesModule } from '../../modules/offices/offices.module';
import { PaymentCustomersModule } from '../../modules/payment-customers/payment-customers.module';
import { SecurityModule } from '../../modules/security/security.module';
import { GetPaymentCustomersByOfficeIdController } from './get-payment-customers-by-office-id.controller';
import { GetPaymentCustomersByOfficeIdUseCase } from './get-payment-customers-by-office-id.use-case';

@Module({
  imports: [
    OfficesModule,
    PaymentCustomersModule,
    SecurityModule,
    UseCaseSupportModule,
  ],
  controllers: [GetPaymentCustomersByOfficeIdController],
  providers: [GetPaymentCustomersByOfficeIdUseCase],
  exports: [GetPaymentCustomersByOfficeIdUseCase],
})
export class GetPaymentCustomersByOfficeIdModule {}
