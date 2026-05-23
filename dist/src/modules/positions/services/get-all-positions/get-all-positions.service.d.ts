import type { IPositionsRepository } from '../../entities/positions-repository.interface';
import { GetAllPositionsDtoIn } from './dtos/get-all-positions.dto-in';
import { GetAllPositionsDtoOut } from './dtos/get-all-positions.dto-out';
export declare class GetAllPositionsService {
    private readonly repository;
    constructor(repository: IPositionsRepository);
    exec(dtoIn: GetAllPositionsDtoIn): Promise<GetAllPositionsDtoOut>;
}
