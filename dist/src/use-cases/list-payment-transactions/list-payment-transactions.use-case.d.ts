import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { GetAllPaymentTransactionsService } from '../../modules/payment-transactions/services/get-all-payment-transactions/get-all-payment-transactions.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { ListPaymentTransactionsDtoIn } from './dtos/list-payment-transactions.dto-in';
import { ListPaymentTransactionsDtoOut } from './dtos/list-payment-transactions.dto-out';
export declare class ListPaymentTransactionsUseCase {
    private readonly resolveActorAuthorizationService;
    private readonly getAllPaymentTransactionsService;
    private readonly handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService: ResolveActorAuthorizationService, getAllPaymentTransactionsService: GetAllPaymentTransactionsService, handleUseCaseExceptionService: HandleUseCaseExceptionService);
    exec(dtoIn: ListPaymentTransactionsDtoIn): Promise<ListPaymentTransactionsDtoOut>;
}
