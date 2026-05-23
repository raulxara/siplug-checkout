import type { IUserPositionsRepository } from '../../entities/user-positions-repository.interface';
import { GetAllUserPositionsByUserCustomerIdsDtoIn } from './dtos/get-all-user-positions-by-user-customer-ids.dto-in';
import { GetAllUserPositionsByUserCustomerIdsDtoOut } from './dtos/get-all-user-positions-by-user-customer-ids.dto-out';
export declare class GetAllUserPositionsByUserCustomerIdsService {
    private readonly repository;
    constructor(repository: IUserPositionsRepository);
    exec(dtoIn: GetAllUserPositionsByUserCustomerIdsDtoIn): Promise<GetAllUserPositionsByUserCustomerIdsDtoOut>;
}
