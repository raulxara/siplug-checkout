import type { IUserPositionsRepository } from '../../entities/user-positions-repository.interface';
import { GetAllUserPositionsByUserCustomerIdDtoIn } from './dtos/get-all-user-positions-by-user-customer-id.dto-in';
import { GetAllUserPositionsByUserCustomerIdDtoOut } from './dtos/get-all-user-positions-by-user-customer-id.dto-out';
export declare class GetAllUserPositionsByUserCustomerIdService {
    private readonly repository;
    constructor(repository: IUserPositionsRepository);
    exec(dtoIn: GetAllUserPositionsByUserCustomerIdDtoIn): Promise<GetAllUserPositionsByUserCustomerIdDtoOut>;
}
