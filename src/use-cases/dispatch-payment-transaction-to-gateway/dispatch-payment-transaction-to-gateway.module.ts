import { Module } from '@nestjs/common';
import { UseCaseSupportModule } from '../../common/services/use-case-support/use-case-support.module';
import { ApiCredentialsModule } from '../../modules/api-credentials/api-credentials.module';
import { ClientsModule } from '../../modules/clients/clients.module';
import { GatewayOrchestrationModule } from '../../modules/gateway-orchestration/gateway-orchestration.module';
import { GatewaysModule } from '../../modules/gateways/gateways.module';
import { OfficesModule } from '../../modules/offices/offices.module';
import { PaymentTransactionsModule } from '../../modules/payment-transactions/payment-transactions.module';
import { SecurityModule } from '../../modules/security/security.module';
import { DispatchPaymentTransactionToGatewayController } from './dispatch-payment-transaction-to-gateway.controller';
import { DispatchPaymentTransactionToGatewayUseCase } from './dispatch-payment-transaction-to-gateway.use-case';

@Module({
  imports: [
    PaymentTransactionsModule,
    OfficesModule,
    ClientsModule,
    GatewaysModule,
    ApiCredentialsModule,
    GatewayOrchestrationModule,
    SecurityModule,
    UseCaseSupportModule,
  ],
  controllers: [DispatchPaymentTransactionToGatewayController],
  providers: [DispatchPaymentTransactionToGatewayUseCase],
  exports: [DispatchPaymentTransactionToGatewayUseCase],
})
export class DispatchPaymentTransactionToGatewayModule {}
