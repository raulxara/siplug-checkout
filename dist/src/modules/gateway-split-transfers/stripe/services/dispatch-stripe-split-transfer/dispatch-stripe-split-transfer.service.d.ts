import { GatewaySplitTransferDtoIn } from '../../../dtos/gateway-split-transfer.dto-in';
import { GatewaySplitTransferDtoOut } from '../../../dtos/gateway-split-transfer.dto-out';
export declare class DispatchStripeSplitTransferService {
    exec(dtoIn: GatewaySplitTransferDtoIn): Promise<GatewaySplitTransferDtoOut>;
    private createTransfer;
    private parseJson;
    private extractString;
}
