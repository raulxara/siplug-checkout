import type { IPaymentTransactionsRepository } from '../../entities/payment-transactions-repository.interface';
import { FindPaymentTransactionByGatewayTransactionIdDtoIn } from './dtos/find-payment-transaction-by-gateway-transaction-id.dto-in';
import { FindPaymentTransactionByGatewayTransactionIdDtoOut } from './dtos/find-payment-transaction-by-gateway-transaction-id.dto-out';
export declare class FindPaymentTransactionByGatewayTransactionIdService {
    private readonly paymentTransactionsRepository;
    constructor(paymentTransactionsRepository: IPaymentTransactionsRepository);
    exec(dtoIn: FindPaymentTransactionByGatewayTransactionIdDtoIn): Promise<FindPaymentTransactionByGatewayTransactionIdDtoOut>;
}
