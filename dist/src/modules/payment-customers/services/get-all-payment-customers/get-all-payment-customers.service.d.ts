import type { IPaymentCustomersRepository } from '../../entities/payment-customers-repository.interface';
import { GetAllPaymentCustomersDtoIn } from './dtos/get-all-payment-customers.dto-in';
import { GetAllPaymentCustomersDtoOut } from './dtos/get-all-payment-customers.dto-out';
export declare class GetAllPaymentCustomersService {
    private readonly repository;
    constructor(repository: IPaymentCustomersRepository);
    exec(dtoIn: GetAllPaymentCustomersDtoIn): Promise<GetAllPaymentCustomersDtoOut>;
}
