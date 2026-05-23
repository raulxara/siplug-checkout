import type { IPositionsRepository } from '../../entities/positions-repository.interface';
import { GetAllPositionsByOfficeIdDtoIn } from './dtos/get-all-positions-by-office-id.dto-in';
import { GetAllPositionsByOfficeIdDtoOut } from './dtos/get-all-positions-by-office-id.dto-out';
export declare class GetAllPositionsByOfficeIdService {
    private readonly repository;
    constructor(repository: IPositionsRepository);
    exec(dtoIn: GetAllPositionsByOfficeIdDtoIn): Promise<GetAllPositionsByOfficeIdDtoOut>;
}
