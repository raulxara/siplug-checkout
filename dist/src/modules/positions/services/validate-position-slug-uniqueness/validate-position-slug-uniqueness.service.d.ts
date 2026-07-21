import type { IPositionsRepository } from '../../entities/positions-repository.interface';
import { ValidatePositionSlugUniquenessDtoIn } from './dtos/validate-position-slug-uniqueness.dto-in';
export declare class ValidatePositionSlugUniquenessService {
    private readonly repository;
    constructor(repository: IPositionsRepository);
    exec(dtoIn: ValidatePositionSlugUniquenessDtoIn): Promise<void>;
}
