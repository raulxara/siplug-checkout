import type { IApiCredentialsRepository } from '../../entities/api-credentials-repository.interface';
import { ListApiCredentialsByOfficeIdDtoIn } from './dtos/list-api-credentials-by-office-id.dto-in';
import { ListApiCredentialsByOfficeIdDtoOut } from './dtos/list-api-credentials-by-office-id.dto-out';
export declare class ListApiCredentialsByOfficeIdService {
    private readonly repository;
    constructor(repository: IApiCredentialsRepository);
    exec(dtoIn: ListApiCredentialsByOfficeIdDtoIn): Promise<ListApiCredentialsByOfficeIdDtoOut>;
}
