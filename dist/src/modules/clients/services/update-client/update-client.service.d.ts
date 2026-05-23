import { BuildChangesHistoryService } from '../../../../common/services/changes-history/build-changes-history.service';
import { HashPasswordService } from '../../../../common/services/security/hash-password.service';
import type { IClientsRepository } from '../../entities/clients-repository.interface';
import { UpdateClientDtoIn } from './dtos/update-client.dto-in';
import { UpdateClientDtoOut } from './dtos/update-client.dto-out';
export declare class UpdateClientService {
    private readonly repository;
    private readonly buildChangesHistoryService;
    private readonly hashPasswordService;
    constructor(repository: IClientsRepository, buildChangesHistoryService: BuildChangesHistoryService, hashPasswordService: HashPasswordService);
    exec(dtoIn: UpdateClientDtoIn): Promise<UpdateClientDtoOut>;
    private removeNullValues;
    private buildOldData;
}
