import type { IPaymentCustomersRepository } from '../../entities/payment-customers-repository.interface';
import { CreatePaymentCustomerDtoIn } from './dtos/create-payment-customer.dto-in';
import { CreatePaymentCustomerDtoOut } from './dtos/create-payment-customer.dto-out';
export declare class CreatePaymentCustomerService {
    private readonly repository;
    constructor(repository: IPaymentCustomersRepository);
    exec(dtoIn: CreatePaymentCustomerDtoIn): Promise<CreatePaymentCustomerDtoOut>;
}
