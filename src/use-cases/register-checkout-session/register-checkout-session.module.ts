import { Module } from '@nestjs/common';
import { UseCaseSupportModule } from '../../common/services/use-case-support/use-case-support.module';
import { ApiCredentialsModule } from '../../modules/api-credentials/api-credentials.module';
import { CheckoutSessionsModule } from '../../modules/checkout-sessions/checkout-sessions.module';
import { ClientsModule } from '../../modules/clients/clients.module';
import { GatewaysModule } from '../../modules/gateways/gateways.module';
import { OfficesModule } from '../../modules/offices/offices.module';
import { PaymentCustomersModule } from '../../modules/payment-customers/payment-customers.module';
import { SecurityModule } from '../../modules/security/security.module';
import { RegisterCheckoutSessionController } from './register-checkout-session.controller';
import { RegisterCheckoutSessionUseCase } from './register-checkout-session.use-case';

@Module({
  imports: [
    OfficesModule,
    ClientsModule,
    PaymentCustomersModule,
    GatewaysModule,
    ApiCredentialsModule,
    CheckoutSessionsModule,
    SecurityModule,
    UseCaseSupportModule,
  ],
  controllers: [RegisterCheckoutSessionController],
  providers: [RegisterCheckoutSessionUseCase],
  exports: [RegisterCheckoutSessionUseCase],
})
export class RegisterCheckoutSessionModule {}
