import type { IPositionsRepository } from '../../entities/positions-repository.interface';
import { GetAllPositionsByUniqueIdsDtoIn } from './dtos/get-all-positions-by-unique-ids.dto-in';
import { GetAllPositionsByUniqueIdsDtoOut } from './dtos/get-all-positions-by-unique-ids.dto-out';
export declare class GetAllPositionsByUniqueIdsService {
    private readonly repository;
    constructor(repository: IPositionsRepository);
    exec(dtoIn: GetAllPositionsByUniqueIdsDtoIn): Promise<GetAllPositionsByUniqueIdsDtoOut>;
}
