import type { IPositionsRepository } from '../../entities/positions-repository.interface';
import { FindPositionByUniqueIdDtoIn } from './dtos/find-position-by-unique-id.dto-in';
import { FindPositionByUniqueIdDtoOut } from './dtos/find-position-by-unique-id.dto-out';
export declare class FindPositionByUniqueIdService {
    private readonly repository;
    constructor(repository: IPositionsRepository);
    exec(dtoIn: FindPositionByUniqueIdDtoIn): Promise<FindPositionByUniqueIdDtoOut>;
}
