import type { IApiCredentialsRepository } from '../../entities/api-credentials-repository.interface';
import { FindApiCredentialByUniqueIdDtoIn } from './dtos/find-api-credential-by-unique-id.dto-in';
import { FindApiCredentialByUniqueIdDtoOut } from './dtos/find-api-credential-by-unique-id.dto-out';
export declare class FindApiCredentialByUniqueIdService {
    private readonly repository;
    constructor(repository: IApiCredentialsRepository);
    exec(dtoIn: FindApiCredentialByUniqueIdDtoIn): Promise<FindApiCredentialByUniqueIdDtoOut>;
}
