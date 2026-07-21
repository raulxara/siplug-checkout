import type { IProfilesRepository } from '../../entities/profiles-repository.interface';
import { ValidateProfileEmailUniquenessDtoIn } from './dtos/validate-profile-email-uniqueness.dto-in';
export declare class ValidateProfileEmailUniquenessService {
    private readonly repository;
    constructor(repository: IProfilesRepository);
    exec(dtoIn: ValidateProfileEmailUniquenessDtoIn): Promise<void>;
}
