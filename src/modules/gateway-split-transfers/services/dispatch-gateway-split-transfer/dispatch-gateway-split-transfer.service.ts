import { Injectable } from '@nestjs/common';

import { GatewaySplitTransferDtoIn } from '../../dtos/gateway-split-transfer.dto-in';
import { GatewaySplitTransferDtoOut } from '../../dtos/gateway-split-transfer.dto-out';
import { DispatchStripeSplitTransferService } from '../../stripe/services/dispatch-stripe-split-transfer/dispatch-stripe-split-transfer.service';

@Injectable()
export class DispatchGatewaySplitTransferService {
  constructor(
    private readonly dispatchStripeSplitTransferService: DispatchStripeSplitTransferService,
  ) {}

  async exec(
    dtoIn: GatewaySplitTransferDtoIn,
  ): Promise<GatewaySplitTransferDtoOut> {
    switch (dtoIn.gatewayProvider) {
      case 'stripe':
        return this.dispatchStripeSplitTransferService.exec(dtoIn);

      default:
        return new GatewaySplitTransferDtoOut(
          false,
          dtoIn.gatewayProvider,
          'gateway_not_supported',
          null,
          [],
          null,
          null,
          {
            provider: dtoIn.gatewayProvider,
            reason: 'gateway split transfer is not implemented yet',
          },
          'gateway split transfer is not implemented yet',
        );
    }
  }
}
