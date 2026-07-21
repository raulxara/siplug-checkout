import { ListPaymentTransactionsUseCase } from './list-payment-transactions.use-case';
export declare class ListPaymentTransactionsController {
    private readonly listPaymentTransactionsUseCase;
    constructor(listPaymentTransactionsUseCase: ListPaymentTransactionsUseCase);
    handle(authorization: string | undefined): Promise<Record<string, unknown>>;
    private extractBearerToken;
}
