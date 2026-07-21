import type { IPositionsRepository } from '../../entities/positions-repository.interface';
import { CreatePositionDtoIn } from './dtos/create-position.dto-in';
import { CreatePositionDtoOut } from './dtos/create-position.dto-out';
export declare class CreatePositionService {
    private readonly repository;
    constructor(repository: IPositionsRepository);
    exec(dtoIn: CreatePositionDtoIn): Promise<CreatePositionDtoOut>;
}
