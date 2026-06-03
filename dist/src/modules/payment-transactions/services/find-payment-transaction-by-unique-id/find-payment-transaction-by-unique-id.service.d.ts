import type { IPaymentTransactionsRepository } from '../../entities/payment-transactions-repository.interface';
import { FindPaymentTransactionByUniqueIdDtoIn } from './dtos/find-payment-transaction-by-unique-id.dto-in';
import { FindPaymentTransactionByUniqueIdDtoOut } from './dtos/find-payment-transaction-by-unique-id.dto-out';
export declare class FindPaymentTransactionByUniqueIdService {
    private readonly repository;
    constructor(repository: IPaymentTransactionsRepository);
    exec(dtoIn: FindPaymentTransactionByUniqueIdDtoIn): Promise<FindPaymentTransactionByUniqueIdDtoOut>;
}
