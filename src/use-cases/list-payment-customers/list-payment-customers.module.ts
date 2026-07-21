import { Module } from '@nestjs/common';
import { UseCaseSupportModule } from '../../common/services/use-case-support/use-case-support.module';
import { OfficesModule } from '../../modules/offices/offices.module';
import { PaymentCustomersModule } from '../../modules/payment-customers/payment-customers.module';
import { SecurityModule } from '../../modules/security/security.module';
import { ListPaymentCustomersController } from './list-payment-customers.controller';
import { ListPaymentCustomersUseCase } from './list-payment-customers.use-case';

@Module({
  imports: [
    OfficesModule,
    PaymentCustomersModule,
    SecurityModule,
    UseCaseSupportModule,
  ],
  controllers: [ListPaymentCustomersController],
  providers: [ListPaymentCustomersUseCase],
  exports: [ListPaymentCustomersUseCase],
})
export class ListPaymentCustomersModule {}