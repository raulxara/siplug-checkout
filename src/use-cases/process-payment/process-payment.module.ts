import { Module } from '@nestjs/common';
import { UseCaseSupportModule } from '../../common/services/use-case-support/use-case-support.module';
import { CheckoutSessionsModule } from '../../modules/checkout-sessions/checkout-sessions.module';
import { ClientsModule } from '../../modules/clients/clients.module';
import { GatewayOrchestrationModule } from '../../modules/gateway-orchestration/gateway-orchestration.module';
import { OfficesModule } from '../../modules/offices/offices.module';
import { PaymentCustomersModule } from '../../modules/payment-customers/payment-customers.module';
import { PaymentTransactionsModule } from '../../modules/payment-transactions/payment-transactions.module';
import { SecurityModule } from '../../modules/security/security.module';
import { ProcessPaymentController } from './process-payment.controller';
import { ProcessPaymentUseCase } from './process-payment.use-case';

@Module({
  imports: [
    OfficesModule,
    ClientsModule,
    PaymentCustomersModule,
    CheckoutSessionsModule,
    PaymentTransactionsModule,
    GatewayOrchestrationModule,
    SecurityModule,
    UseCaseSupportModule,
  ],
  controllers: [ProcessPaymentController],
  providers: [ProcessPaymentUseCase],
  exports: [ProcessPaymentUseCase],
})
export class ProcessPaymentModule {}
