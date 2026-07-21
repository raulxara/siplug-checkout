import { BuildChangesHistoryService } from '../../../../common/services/changes-history/build-changes-history.service';
import type { IProfilesRepository } from '../../entities/profiles-repository.interface';
import { UpdateProfileDtoIn } from './dtos/update-profile.dto-in';
import { UpdateProfileDtoOut } from './dtos/update-profile.dto-out';
export declare class UpdateProfileService {
    private readonly repository;
    private readonly buildChangesHistoryService;
    constructor(repository: IProfilesRepository, buildChangesHistoryService: BuildChangesHistoryService);
    exec(dtoIn: UpdateProfileDtoIn): Promise<UpdateProfileDtoOut>;
    private removeNullValues;
    private buildOldData;
}
