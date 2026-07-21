import type { IUserAccessCodesRepository } from '../../entities/user-access-codes-repository.interface';
import { GetAllUserAccessCodesByUserCustomerIdDtoIn } from './dtos/get-all-user-access-codes-by-user-customer-id.dto-in';
import { GetAllUserAccessCodesByUserCustomerIdDtoOut } from './dtos/get-all-user-access-codes-by-user-customer-id.dto-out';
export declare class GetAllUserAccessCodesByUserCustomerIdService {
    private readonly repository;
    constructor(repository: IUserAccessCodesRepository);
    exec(dtoIn: GetAllUserAccessCodesByUserCustomerIdDtoIn): Promise<GetAllUserAccessCodesByUserCustomerIdDtoOut>;
}
