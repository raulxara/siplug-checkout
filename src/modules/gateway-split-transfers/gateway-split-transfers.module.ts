import { Module } from '@nestjs/common';

import { DispatchGatewaySplitTransferService } from './services/dispatch-gateway-split-transfer/dispatch-gateway-split-transfer.service';
import { DispatchStripeSplitTransferService } from './stripe/services/dispatch-stripe-split-transfer/dispatch-stripe-split-transfer.service';
import { CreateStripeTransferReversalService } from './stripe/services/create-stripe-transfer-reversal/create-stripe-transfer-reversal.service';
import { RetrieveStripeTransferService } from './stripe/services/retrieve-stripe-transfer/retrieve-stripe-transfer.service';

@Module({
  providers: [
    DispatchGatewaySplitTransferService,
    DispatchStripeSplitTransferService,
    RetrieveStripeTransferService,
    CreateStripeTransferReversalService,
  ],
  exports: [
    DispatchGatewaySplitTransferService,
    DispatchStripeSplitTransferService,
    RetrieveStripeTransferService,
    CreateStripeTransferReversalService,
  ],
})
export class GatewaySplitTransfersModule {}