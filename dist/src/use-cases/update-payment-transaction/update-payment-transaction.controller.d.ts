import { UpdatePaymentTransactionRequest } from './http/update-payment-transaction.request';
import { UpdatePaymentTransactionUseCase } from './update-payment-transaction.use-case';
export declare class UpdatePaymentTransactionController {
    private readonly updatePaymentTransactionUseCase;
    constructor(updatePaymentTransactionUseCase: UpdatePaymentTransactionUseCase);
    handle(authorization: string | undefined, body: UpdatePaymentTransactionRequest): Promise<Record<string, unknown>>;
    private extractBearerToken;
}
