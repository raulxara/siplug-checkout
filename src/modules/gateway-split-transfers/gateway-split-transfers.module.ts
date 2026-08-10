import { Module } from '@nestjs/common';

import { DispatchGatewaySplitTransferService } from './services/dispatch-gateway-split-transfer/dispatch-gateway-split-transfer.service';
import { DispatchStripeSplitTransferService } from './stripe/services/dispatch-stripe-split-transfer/dispatch-stripe-split-transfer.service';
import { RetrieveStripeTransferService } from './stripe/services/retrieve-stripe-transfer/retrieve-stripe-transfer.service';

@Module({
  providers: [
    DispatchGatewaySplitTransferService,
    DispatchStripeSplitTransferService,
    RetrieveStripeTransferService,
  ],
  exports: [
    DispatchGatewaySplitTransferService,
    DispatchStripeSplitTransferService,
    RetrieveStripeTransferService,
  ],
})
export class GatewaySplitTransfersModule {}