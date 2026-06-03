import type { IUserPositionsRepository } from '../../entities/user-positions-repository.interface';
import { FindUserPositionByUserCustomerAndPositionDtoIn } from './dtos/find-user-position-by-user-customer-and-position.dto-in';
import { FindUserPositionByUserCustomerAndPositionDtoOut } from './dtos/find-user-position-by-user-customer-and-position.dto-out';
export declare class FindUserPositionByUserCustomerAndPositionService {
    private readonly repository;
    constructor(repository: IUserPositionsRepository);
    exec(dtoIn: FindUserPositionByUserCustomerAndPositionDtoIn): Promise<FindUserPositionByUserCustomerAndPositionDtoOut>;
}
