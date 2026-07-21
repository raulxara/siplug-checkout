import type { IUserPositionsRepository } from '../../entities/user-positions-repository.interface';
import { GetAllUserPositionsDtoIn } from './dtos/get-all-user-positions.dto-in';
import { GetAllUserPositionsDtoOut } from './dtos/get-all-user-positions.dto-out';
export declare class GetAllUserPositionsService {
    private readonly repository;
    constructor(repository: IUserPositionsRepository);
    exec(dtoIn: GetAllUserPositionsDtoIn): Promise<GetAllUserPositionsDtoOut>;
}
