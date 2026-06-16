import { GatewaySplitTransferDtoIn } from '../../dtos/gateway-split-transfer.dto-in';
import { GatewaySplitTransferDtoOut } from '../../dtos/gateway-split-transfer.dto-out';
import { DispatchStripeSplitTransferService } from '../../stripe/services/dispatch-stripe-split-transfer/dispatch-stripe-split-transfer.service';
export declare class DispatchGatewaySplitTransferService {
    private readonly dispatchStripeSplitTransferService;
    constructor(dispatchStripeSplitTransferService: DispatchStripeSplitTransferService);
    exec(dtoIn: GatewaySplitTransferDtoIn): Promise<GatewaySplitTransferDtoOut>;
}
