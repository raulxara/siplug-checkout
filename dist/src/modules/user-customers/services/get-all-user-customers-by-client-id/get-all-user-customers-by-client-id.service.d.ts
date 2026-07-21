import type { IUserCustomersRepository } from '../../entities/user-customers-repository.interface';
import { GetAllUserCustomersByClientIdDtoIn } from './dtos/get-all-user-customers-by-client-id.dto-in';
import { GetAllUserCustomersByClientIdDtoOut } from './dtos/get-all-user-customers-by-client-id.dto-out';
export declare class GetAllUserCustomersByClientIdService {
    private readonly repository;
    constructor(repository: IUserCustomersRepository);
    exec(dtoIn: GetAllUserCustomersByClientIdDtoIn): Promise<GetAllUserCustomersByClientIdDtoOut>;
}
