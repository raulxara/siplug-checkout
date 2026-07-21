import type { IApiCredentialsRepository } from '../../entities/api-credentials-repository.interface';
import { CreateApiCredentialDtoIn } from './dtos/create-api-credential.dto-in';
import { CreateApiCredentialDtoOut } from './dtos/create-api-credential.dto-out';
export declare class CreateApiCredentialService {
    private readonly repository;
    constructor(repository: IApiCredentialsRepository);
    exec(dtoIn: CreateApiCredentialDtoIn): Promise<CreateApiCredentialDtoOut>;
}
