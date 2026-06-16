import { Module } from '@nestjs/common';

import { ApiCredentialsModule } from '../../modules/api-credentials/api-credentials.module';
import { GatewaySplitTransfersModule } from '../../modules/gateway-split-transfers/gateway-split-transfers.module';
import { PaymentSplitRecipientsModule } from '../../modules/payment-split-recipients/payment-split-recipients.module';
import { PaymentSplitsModule } from '../../modules/payment-splits/payment-splits.module';
import { PaymentTransactionsModule } from '../../modules/payment-transactions/payment-transactions.module';
import { UseCaseSupportModule } from '../../common/services/use-case-support/use-case-support.module';
import { DispatchPaymentSplitToGatewayUseCase } from './dispatch-payment-split-to-gateway.use-case';

@Module({
  imports: [
    UseCaseSupportModule,
    ApiCredentialsModule,
    PaymentSplitsModule,
    PaymentSplitRecipientsModule,
    PaymentTransactionsModule,
    GatewaySplitTransfersModule,
  ],
  providers: [DispatchPaymentSplitToGatewayUseCase],
  exports: [DispatchPaymentSplitToGatewayUseCase],
})
export class DispatchPaymentSplitToGatewayModule {}
