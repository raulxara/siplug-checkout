import type { IPermissionsRepository } from '../../entities/permissions-repository.interface';
import { ValidatePermissionSlugUniquenessDtoIn } from './dtos/validate-permission-slug-uniqueness.dto-in';
export declare class ValidatePermissionSlugUniquenessService {
    private readonly repository;
    constructor(repository: IPermissionsRepository);
    exec(dtoIn: ValidatePermissionSlugUniquenessDtoIn): Promise<void>;
}
