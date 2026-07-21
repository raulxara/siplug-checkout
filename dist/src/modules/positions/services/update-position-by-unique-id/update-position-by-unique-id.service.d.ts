import type { IPositionsRepository } from '../../entities/positions-repository.interface';
import { UpdatePositionByUniqueIdDtoIn } from './dtos/update-position-by-unique-id.dto-in';
import { UpdatePositionByUniqueIdDtoOut } from './dtos/update-position-by-unique-id.dto-out';
export declare class UpdatePositionByUniqueIdService {
    private readonly positionsRepository;
    constructor(positionsRepository: IPositionsRepository);
    exec(dtoIn: UpdatePositionByUniqueIdDtoIn): Promise<UpdatePositionByUniqueIdDtoOut>;
}
