import type { IPositionsRepository } from '../../entities/positions-repository.interface';
import { ListPositionsByOfficeIdDtoIn } from './dtos/list-positions-by-office-id.dto-in';
import { ListPositionsByOfficeIdDtoOut } from './dtos/list-positions-by-office-id.dto-out';
export declare class ListPositionsByOfficeIdService {
    private readonly positionsRepository;
    constructor(positionsRepository: IPositionsRepository);
    exec(dtoIn: ListPositionsByOfficeIdDtoIn): Promise<ListPositionsByOfficeIdDtoOut>;
}
