import type { IUserCustomersRepository } from '../../entities/user-customers-repository.interface';
import { GetAllUserCustomersDtoIn } from './dtos/get-all-user-customers.dto-in';
import { GetAllUserCustomersDtoOut } from './dtos/get-all-user-customers.dto-out';
export declare class GetAllUserCustomersService {
    private readonly repository;
    constructor(repository: IUserCustomersRepository);
    exec(dtoIn: GetAllUserCustomersDtoIn): Promise<GetAllUserCustomersDtoOut>;
}
