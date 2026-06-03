import type { IPositionsRepository } from '../../entities/positions-repository.interface';
import { FindPositionBySlugDtoIn } from './dtos/find-position-by-slug.dto-in';
import { FindPositionBySlugDtoOut } from './dtos/find-position-by-slug.dto-out';
export declare class FindPositionBySlugService {
    private readonly repository;
    constructor(repository: IPositionsRepository);
    exec(dtoIn: FindPositionBySlugDtoIn): Promise<FindPositionBySlugDtoOut>;
}
