import { Module } from '@nestjs/common';
import { UseCaseSupportModule } from '../../common/services/use-case-support/use-case-support.module';
import { ClientsModule } from '../../modules/clients/clients.module';
import { OfficesModule } from '../../modules/offices/offices.module';
import { PaymentCustomersModule } from '../../modules/payment-customers/payment-customers.module';
import { ProfilesModule } from '../../modules/profiles/profiles.module';
import { SecurityModule } from '../../modules/security/security.module';
import { UpdatePaymentCustomerController } from './update-payment-customer.controller';
import { UpdatePaymentCustomerUseCase } from './update-payment-customer.use-case';

@Module({
  imports: [
    OfficesModule,
    ClientsModule,
    ProfilesModule,
    PaymentCustomersModule,
    SecurityModule,
    UseCaseSupportModule,
  ],
  controllers: [UpdatePaymentCustomerController],
  providers: [UpdatePaymentCustomerUseCase],
  exports: [UpdatePaymentCustomerUseCase],
})
export class UpdatePaymentCustomerModule {}