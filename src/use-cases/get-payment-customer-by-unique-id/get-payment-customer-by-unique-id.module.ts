import { Module } from '@nestjs/common';
import { UseCaseSupportModule } from '../../common/services/use-case-support/use-case-support.module';
import { OfficesModule } from '../../modules/offices/offices.module';
import { PaymentCustomersModule } from '../../modules/payment-customers/payment-customers.module';
import { SecurityModule } from '../../modules/security/security.module';
import { GetPaymentCustomerByUniqueIdController } from './get-payment-customer-by-unique-id.controller';
import { GetPaymentCustomerByUniqueIdUseCase } from './get-payment-customer-by-unique-id.use-case';

@Module({
  imports: [
    OfficesModule,
    PaymentCustomersModule,
    SecurityModule,
    UseCaseSupportModule,
  ],
  controllers: [GetPaymentCustomerByUniqueIdController],
  providers: [GetPaymentCustomerByUniqueIdUseCase],
  exports: [GetPaymentCustomerByUniqueIdUseCase],
})
export class GetPaymentCustomerByUniqueIdModule {}