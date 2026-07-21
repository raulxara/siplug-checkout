import { BuildChangesHistoryService } from '../../../../common/services/changes-history/build-changes-history.service';
import type { IApiCredentialsRepository } from '../../entities/api-credentials-repository.interface';
import { UpdateApiCredentialDtoIn } from './dtos/update-api-credential.dto-in';
import { UpdateApiCredentialDtoOut } from './dtos/update-api-credential.dto-out';
export declare class UpdateApiCredentialService {
    private readonly repository;
    private readonly buildChangesHistoryService;
    constructor(repository: IApiCredentialsRepository, buildChangesHistoryService: BuildChangesHistoryService);
    exec(dtoIn: UpdateApiCredentialDtoIn): Promise<UpdateApiCredentialDtoOut>;
    private removeNullValues;
    private buildOldData;
    private sanitizeConfig;
    private isSensitiveKey;
}
