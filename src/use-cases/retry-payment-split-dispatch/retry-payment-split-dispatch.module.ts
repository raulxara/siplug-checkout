import { Module } from '@nestjs/common';

import { UseCaseSupportModule } from '../../common/services/use-case-support/use-case-support.module';
import { PaymentSplitsModule } from '../../modules/payment-splits/payment-splits.module';

import { DispatchPaymentSplitToGatewayModule } from '../dispatch-payment-split-to-gateway/dispatch-payment-split-to-gateway.module';
import { ReconcilePaymentSplitWithGatewayModule } from '../reconcile-payment-split-with-gateway/reconcile-payment-split-with-gateway.module';

import { RetryPaymentSplitDispatchController } from './retry-payment-split-dispatch.controller';
import { RetryPaymentSplitDispatchUseCase } from './retry-payment-split-dispatch.use-case';

@Module({
  imports: [
    PaymentSplitsModule,
    DispatchPaymentSplitToGatewayModule,
    ReconcilePaymentSplitWithGatewayModule,
    UseCaseSupportModule,
  ],
  controllers: [RetryPaymentSplitDispatchController],
  providers: [RetryPaymentSplitDispatchUseCase],
  exports: [RetryPaymentSplitDispatchUseCase],
})
export class RetryPaymentSplitDispatchModule {}
