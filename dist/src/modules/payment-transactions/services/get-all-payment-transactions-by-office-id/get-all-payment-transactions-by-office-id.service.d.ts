import type { IPaymentTransactionsRepository } from '../../entities/payment-transactions-repository.interface';
import { GetAllPaymentTransactionsByOfficeIdDtoIn } from './dtos/get-all-payment-transactions-by-office-id.dto-in';
import { GetAllPaymentTransactionsByOfficeIdDtoOut } from './dtos/get-all-payment-transactions-by-office-id.dto-out';
export declare class GetAllPaymentTransactionsByOfficeIdService {
    private readonly repository;
    constructor(repository: IPaymentTransactionsRepository);
    exec(dtoIn: GetAllPaymentTransactionsByOfficeIdDtoIn): Promise<GetAllPaymentTransactionsByOfficeIdDtoOut>;
}
