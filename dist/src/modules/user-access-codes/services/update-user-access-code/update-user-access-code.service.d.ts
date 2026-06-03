import { BuildChangesHistoryService } from '../../../../common/services/changes-history/build-changes-history.service';
import type { IUserAccessCodesRepository } from '../../entities/user-access-codes-repository.interface';
import { UpdateUserAccessCodeDtoIn } from './dtos/update-user-access-code.dto-in';
import { UpdateUserAccessCodeDtoOut } from './dtos/update-user-access-code.dto-out';
export declare class UpdateUserAccessCodeService {
    private readonly repository;
    private readonly buildChangesHistoryService;
    constructor(repository: IUserAccessCodesRepository, buildChangesHistoryService: BuildChangesHistoryService);
    exec(dtoIn: UpdateUserAccessCodeDtoIn): Promise<UpdateUserAccessCodeDtoOut>;
    private removeNullValues;
    private buildOldData;
}
