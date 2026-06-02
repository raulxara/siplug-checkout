import type { IPaymentTransactionsRepository } from '../../entities/payment-transactions-repository.interface';
import { GetAllPaymentTransactionsDtoIn } from './dtos/get-all-payment-transactions.dto-in';
import { GetAllPaymentTransactionsDtoOut } from './dtos/get-all-payment-transactions.dto-out';
export declare class GetAllPaymentTransactionsService {
    private readonly repository;
    constructor(repository: IPaymentTransactionsRepository);
    exec(_dtoIn: GetAllPaymentTransactionsDtoIn): Promise<GetAllPaymentTransactionsDtoOut>;
}
