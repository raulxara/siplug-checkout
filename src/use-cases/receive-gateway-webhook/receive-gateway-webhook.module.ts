import { Module } from '@nestjs/common';
import { UseCaseSupportModule } from '../../common/services/use-case-support/use-case-support.module';
import { ApiCredentialsModule } from '../../modules/api-credentials/api-credentials.module';
import { CheckoutSessionsModule } from '../../modules/checkout-sessions/checkout-sessions.module';
import { GatewayOrchestrationModule } from '../../modules/gateway-orchestration/gateway-orchestration.module';
import { PaymentTransactionsModule } from '../../modules/payment-transactions/payment-transactions.module';
import { ReceiveGatewayWebhookController } from './receive-gateway-webhook.controller';
import { ReceiveGatewayWebhookUseCase } from './receive-gateway-webhook.use-case';

@Module({
  imports: [
    PaymentTransactionsModule,
    ApiCredentialsModule,
    CheckoutSessionsModule,
    GatewayOrchestrationModule,
    UseCaseSupportModule,
  ],
  controllers: [ReceiveGatewayWebhookController],
  providers: [ReceiveGatewayWebhookUseCase],
  exports: [ReceiveGatewayWebhookUseCase],
})
export class ReceiveGatewayWebhookModule {}
