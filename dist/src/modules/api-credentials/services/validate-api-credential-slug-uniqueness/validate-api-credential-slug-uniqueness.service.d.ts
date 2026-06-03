import type { IApiCredentialsRepository } from '../../entities/api-credentials-repository.interface';
import { ValidateApiCredentialSlugUniquenessDtoIn } from './dtos/validate-api-credential-slug-uniqueness.dto-in';
export declare class ValidateApiCredentialSlugUniquenessService {
    private readonly repository;
    constructor(repository: IApiCredentialsRepository);
    exec(dtoIn: ValidateApiCredentialSlugUniquenessDtoIn): Promise<void>;
}
