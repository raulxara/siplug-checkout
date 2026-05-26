import { BuildChangesHistoryService } from '../../../../common/services/changes-history/build-changes-history.service';
import type { IGatewaysRepository } from '../../entities/gateways-repository.interface';
import { UpdateGatewayDtoIn } from './dtos/update-gateway.dto-in';
import { UpdateGatewayDtoOut } from './dtos/update-gateway.dto-out';
export declare class UpdateGatewayService {
    private readonly repository;
    private readonly buildChangesHistoryService;
    constructor(repository: IGatewaysRepository, buildChangesHistoryService: BuildChangesHistoryService);
    exec(dtoIn: UpdateGatewayDtoIn): Promise<UpdateGatewayDtoOut>;
    private removeNullValues;
    private buildOldData;
}
