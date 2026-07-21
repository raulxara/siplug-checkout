import type { IPaymentCustomersRepository } from '../../entities/payment-customers-repository.interface';
import { GetAllPaymentCustomersByOfficeIdDtoIn } from './dtos/get-all-payment-customers-by-office-id.dto-in';
import { GetAllPaymentCustomersByOfficeIdDtoOut } from './dtos/get-all-payment-customers-by-office-id.dto-out';
export declare class GetAllPaymentCustomersByOfficeIdService {
    private readonly repository;
    constructor(repository: IPaymentCustomersRepository);
    exec(dtoIn: GetAllPaymentCustomersByOfficeIdDtoIn): Promise<GetAllPaymentCustomersByOfficeIdDtoOut>;
}
