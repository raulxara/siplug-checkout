import type { IPaymentTransactionsRepository } from '../../entities/payment-transactions-repository.interface';
import { GetAllPaymentTransactionsByCheckoutSessionIdDtoIn } from './dtos/get-all-payment-transactions-by-checkout-session-id.dto-in';
import { GetAllPaymentTransactionsByCheckoutSessionIdDtoOut } from './dtos/get-all-payment-transactions-by-checkout-session-id.dto-out';
export declare class GetAllPaymentTransactionsByCheckoutSessionIdService {
    private readonly repository;
    constructor(repository: IPaymentTransactionsRepository);
    exec(dtoIn: GetAllPaymentTransactionsByCheckoutSessionIdDtoIn): Promise<GetAllPaymentTransactionsByCheckoutSessionIdDtoOut>;
}
