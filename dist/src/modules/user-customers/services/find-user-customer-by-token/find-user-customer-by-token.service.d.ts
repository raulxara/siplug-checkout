import type { IUserCustomersRepository } from '../../entities/user-customers-repository.interface';
import { FindUserCustomerByTokenDtoIn } from './dtos/find-user-customer-by-token.dto-in';
import { FindUserCustomerByTokenDtoOut } from './dtos/find-user-customer-by-token.dto-out';
export declare class FindUserCustomerByTokenService {
    private readonly repository;
    constructor(repository: IUserCustomersRepository);
    exec(dtoIn: FindUserCustomerByTokenDtoIn): Promise<FindUserCustomerByTokenDtoOut>;
}
