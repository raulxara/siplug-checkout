import { GetPaymentTransactionByUniqueIdRequest } from './http/get-payment-transaction-by-unique-id.request';
import { GetPaymentTransactionByUniqueIdUseCase } from './get-payment-transaction-by-unique-id.use-case';
export declare class GetPaymentTransactionByUniqueIdController {
    private readonly getPaymentTransactionByUniqueIdUseCase;
    constructor(getPaymentTransactionByUniqueIdUseCase: GetPaymentTransactionByUniqueIdUseCase);
    handle(authorization: string | undefined, body: GetPaymentTransactionByUniqueIdRequest): Promise<Record<string, unknown>>;
    private extractBearerToken;
}
