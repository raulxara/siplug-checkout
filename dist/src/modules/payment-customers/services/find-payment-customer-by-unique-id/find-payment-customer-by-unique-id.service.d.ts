import type { IPaymentCustomersRepository } from '../../entities/payment-customers-repository.interface';
import { FindPaymentCustomerByUniqueIdDtoIn } from './dtos/find-payment-customer-by-unique-id.dto-in';
import { FindPaymentCustomerByUniqueIdDtoOut } from './dtos/find-payment-customer-by-unique-id.dto-out';
export declare class FindPaymentCustomerByUniqueIdService {
    private readonly repository;
    constructor(repository: IPaymentCustomersRepository);
    exec(dtoIn: FindPaymentCustomerByUniqueIdDtoIn): Promise<FindPaymentCustomerByUniqueIdDtoOut>;
}
