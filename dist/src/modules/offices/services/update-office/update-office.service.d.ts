import { BuildChangesHistoryService } from '../../../../common/services/changes-history/build-changes-history.service';
import type { IOfficesRepository } from '../../entities/offices-repository.interface';
import { UpdateOfficeDtoIn } from './dtos/update-office.dto-in';
import { UpdateOfficeDtoOut } from './dtos/update-office.dto-out';
export declare class UpdateOfficeService {
    private readonly repository;
    private readonly buildChangesHistoryService;
    constructor(repository: IOfficesRepository, buildChangesHistoryService: BuildChangesHistoryService);
    exec(dtoIn: UpdateOfficeDtoIn): Promise<UpdateOfficeDtoOut>;
    private removeNullValues;
    private buildOldData;
}
