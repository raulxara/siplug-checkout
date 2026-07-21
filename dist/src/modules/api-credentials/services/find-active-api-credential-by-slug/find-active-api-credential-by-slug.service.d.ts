import type { IApiCredentialsRepository } from '../../entities/api-credentials-repository.interface';
import { FindActiveApiCredentialBySlugDtoIn } from './dtos/find-active-api-credential-by-slug.dto-in';
import { FindActiveApiCredentialBySlugDtoOut } from './dtos/find-active-api-credential-by-slug.dto-out';
export declare class FindActiveApiCredentialBySlugService {
    private readonly repository;
    constructor(repository: IApiCredentialsRepository);
    exec(dtoIn: FindActiveApiCredentialBySlugDtoIn): Promise<FindActiveApiCredentialBySlugDtoOut>;
}
