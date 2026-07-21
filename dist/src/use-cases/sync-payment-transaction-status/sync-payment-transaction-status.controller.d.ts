import { SyncPaymentTransactionStatusRequest } from './http/sync-payment-transaction-status.request';
import { SyncPaymentTransactionStatusUseCase } from './sync-payment-transaction-status.use-case';
export declare class SyncPaymentTransactionStatusController {
    private readonly syncPaymentTransactionStatusUseCase;
    constructor(syncPaymentTransactionStatusUseCase: SyncPaymentTransactionStatusUseCase);
    handle(authorization: string | undefined, body: SyncPaymentTransactionStatusRequest): Promise<Record<string, unknown>>;
    private extractBearerToken;
}
