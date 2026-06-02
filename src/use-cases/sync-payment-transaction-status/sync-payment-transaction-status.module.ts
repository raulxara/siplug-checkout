import { Module } from '@nestjs/common';
import { UseCaseSupportModule } from '../../common/services/use-case-support/use-case-support.module';
import { CheckoutSessionsModule } from '../../modules/checkout-sessions/checkout-sessions.module';
import { GatewayOrchestrationModule } from '../../modules/gateway-orchestration/gateway-orchestration.module';
import { PaymentTransactionsModule } from '../../modules/payment-transactions/payment-transactions.module';
import { SecurityModule } from '../../modules/security/security.module';
import { SyncPaymentTransactionStatusController } from './sync-payment-transaction-status.controller';
import { SyncPaymentTransactionStatusUseCase } from './sync-payment-transaction-status.use-case';

@Module({
  imports: [
    PaymentTransactionsModule,
    CheckoutSessionsModule,
    GatewayOrchestrationModule,
    SecurityModule,
    UseCaseSupportModule,
  ],
  controllers: [SyncPaymentTransactionStatusController],
  providers: [SyncPaymentTransactionStatusUseCase],
  exports: [SyncPaymentTransactionStatusUseCase],
})
export class SyncPaymentTransactionStatusModule {}
