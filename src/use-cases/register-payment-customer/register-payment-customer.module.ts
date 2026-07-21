import { Module } from '@nestjs/common';
import { UseCaseSupportModule } from '../../common/services/use-case-support/use-case-support.module';
import { ClientsModule } from '../../modules/clients/clients.module';
import { OfficesModule } from '../../modules/offices/offices.module';
import { PaymentCustomersModule } from '../../modules/payment-customers/payment-customers.module';
import { ProfilesModule } from '../../modules/profiles/profiles.module';
import { SecurityModule } from '../../modules/security/security.module';
import { RegisterPaymentCustomerController } from './register-payment-customer.controller';
import { RegisterPaymentCustomerUseCase } from './register-payment-customer.use-case';

@Module({
  imports: [
    OfficesModule,
    ClientsModule,
    ProfilesModule,
    PaymentCustomersModule,
    SecurityModule,
    UseCaseSupportModule,
  ],
  controllers: [RegisterPaymentCustomerController],
  providers: [RegisterPaymentCustomerUseCase],
  exports: [RegisterPaymentCustomerUseCase],
})
export class RegisterPaymentCustomerModule {}