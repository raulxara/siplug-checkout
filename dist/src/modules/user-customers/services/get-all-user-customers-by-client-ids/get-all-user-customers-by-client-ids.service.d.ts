import type { IUserCustomersRepository } from '../../entities/user-customers-repository.interface';
import { GetAllUserCustomersByClientIdsDtoIn } from './dtos/get-all-user-customers-by-client-ids.dto-in';
import { GetAllUserCustomersByClientIdsDtoOut } from './dtos/get-all-user-customers-by-client-ids.dto-out';
export declare class GetAllUserCustomersByClientIdsService {
    private readonly repository;
    constructor(repository: IUserCustomersRepository);
    exec(dtoIn: GetAllUserCustomersByClientIdsDtoIn): Promise<GetAllUserCustomersByClientIdsDtoOut>;
}
