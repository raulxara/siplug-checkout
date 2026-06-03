import type { IUserCustomersRepository } from '../../entities/user-customers-repository.interface';
import { CreateUserCustomerDtoIn } from './dtos/create-user-customer.dto-in';
import { CreateUserCustomerDtoOut } from './dtos/create-user-customer.dto-out';
export declare class CreateUserCustomerService {
    private readonly repository;
    constructor(repository: IUserCustomersRepository);
    exec(dtoIn: CreateUserCustomerDtoIn): Promise<CreateUserCustomerDtoOut>;
}
