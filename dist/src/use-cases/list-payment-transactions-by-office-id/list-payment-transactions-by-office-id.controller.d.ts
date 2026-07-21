import { ListPaymentTransactionsByOfficeIdRequest } from './http/list-payment-transactions-by-office-id.request';
import { ListPaymentTransactionsByOfficeIdUseCase } from './list-payment-transactions-by-office-id.use-case';
export declare class ListPaymentTransactionsByOfficeIdController {
    private readonly listPaymentTransactionsByOfficeIdUseCase;
    constructor(listPaymentTransactionsByOfficeIdUseCase: ListPaymentTransactionsByOfficeIdUseCase);
    handle(authorization: string | undefined, body: ListPaymentTransactionsByOfficeIdRequest): Promise<Record<string, unknown>>;
    private extractBearerToken;
}
