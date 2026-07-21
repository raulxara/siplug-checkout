import type { IUserPositionsRepository } from '../../entities/user-positions-repository.interface';
import { CreateUserPositionDtoIn } from './dtos/create-user-position.dto-in';
import { CreateUserPositionDtoOut } from './dtos/create-user-position.dto-out';
export declare class CreateUserPositionService {
    private readonly repository;
    constructor(repository: IUserPositionsRepository);
    exec(dtoIn: CreateUserPositionDtoIn): Promise<CreateUserPositionDtoOut>;
}
