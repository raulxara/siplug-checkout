import { Module } from '@nestjs/common';

import { DispatchGatewaySplitTransferService } from './services/dispatch-gateway-split-transfer/dispatch-gateway-split-transfer.service';
import { DispatchStripeSplitTransferService } from './stripe/services/dispatch-stripe-split-transfer/dispatch-stripe-split-transfer.service';

@Module({
  providers: [
    DispatchGatewaySplitTransferService,
    DispatchStripeSplitTransferService,
  ],
  exports: [DispatchGatewaySplitTransferService],
})
export class GatewaySplitTransfersModule {}
