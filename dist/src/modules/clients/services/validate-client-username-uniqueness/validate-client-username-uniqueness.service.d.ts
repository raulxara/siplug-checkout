import type { IClientsRepository } from '../../entities/clients-repository.interface';
import { ValidateClientUsernameUniquenessDtoIn } from './dtos/validate-client-username-uniqueness.dto-in';
export declare class ValidateClientUsernameUniquenessService {
    private readonly repository;
    constructor(repository: IClientsRepository);
    exec(dtoIn: ValidateClientUsernameUniquenessDtoIn): Promise<void>;
}
