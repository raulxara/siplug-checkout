import type { IPaymentTransactionsRepository } from '../../entities/payment-transactions-repository.interface';
import { CreatePaymentTransactionDtoIn } from './dtos/create-payment-transaction.dto-in';
import { CreatePaymentTransactionDtoOut } from './dtos/create-payment-transaction.dto-out';
export declare class CreatePaymentTransactionService {
    private readonly repository;
    constructor(repository: IPaymentTransactionsRepository);
    exec(dtoIn: CreatePaymentTransactionDtoIn): Promise<CreatePaymentTransactionDtoOut>;
}
