import { Module } from '@nestjs/common';

import { UseCaseSupportModule } from '../../common/services/use-case-support/use-case-support.module';
import { ApiCredentialsModule } from '../../modules/api-credentials/api-credentials.module';
import { GatewaySplitTransfersModule } from '../../modules/gateway-split-transfers/gateway-split-transfers.module';
import { GetMercadoPagoPaymentService } from '../../modules/payment-webhook-gateways/mercado-pago/services/get-mercado-pago-payment/get-mercado-pago-payment.service';
import { PaymentSplitRecipientsModule } from '../../modules/payment-split-recipients/payment-split-recipients.module';
import { PaymentSplitsModule } from '../../modules/payment-splits/payment-splits.module';
import { PaymentTransactionsModule } from '../../modules/payment-transactions/payment-transactions.module';
import { SecurityModule } from '../../modules/security/security.module';

import { ReconcilePaymentSplitWithGatewayController } from './reconcile-payment-split-with-gateway.controller';
import { ReconcilePaymentSplitWithGatewayUseCase } from './reconcile-payment-split-with-gateway.use-case';

@Module({
  imports: [
    SecurityModule,
    PaymentSplitsModule,
    PaymentSplitRecipientsModule,
    PaymentTransactionsModule,
    ApiCredentialsModule,
    GatewaySplitTransfersModule,
    UseCaseSupportModule,
  ],
  controllers: [ReconcilePaymentSplitWithGatewayController],
  providers: [
    ReconcilePaymentSplitWithGatewayUseCase,
    GetMercadoPagoPaymentService,
  ],
  exports: [ReconcilePaymentSplitWithGatewayUseCase],
})
export class ReconcilePaymentSplitWithGatewayModule {}