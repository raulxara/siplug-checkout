import type { IUserCustomersRepository } from '../../entities/user-customers-repository.interface';
import { FindUserCustomerByUniqueIdDtoIn } from './dtos/find-user-customer-by-unique-id.dto-in';
import { FindUserCustomerByUniqueIdDtoOut } from './dtos/find-user-customer-by-unique-id.dto-out';
export declare class FindUserCustomerByUniqueIdService {
    private readonly repository;
    constructor(repository: IUserCustomersRepository);
    exec(dtoIn: FindUserCustomerByUniqueIdDtoIn): Promise<FindUserCustomerByUniqueIdDtoOut>;
}
