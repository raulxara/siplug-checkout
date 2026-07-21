import type { IUserPositionsRepository } from '../../entities/user-positions-repository.interface';
import { FindUserPositionByUniqueIdDtoIn } from './dtos/find-user-position-by-unique-id.dto-in';
import { FindUserPositionByUniqueIdDtoOut } from './dtos/find-user-position-by-unique-id.dto-out';
export declare class FindUserPositionByUniqueIdService {
    private readonly repository;
    constructor(repository: IUserPositionsRepository);
    exec(dtoIn: FindUserPositionByUniqueIdDtoIn): Promise<FindUserPositionByUniqueIdDtoOut>;
}
