import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { GetAllPaymentTransactionsByOfficeIdService } from '../../modules/payment-transactions/services/get-all-payment-transactions-by-office-id/get-all-payment-transactions-by-office-id.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { ListPaymentTransactionsByOfficeIdDtoIn } from './dtos/list-payment-transactions-by-office-id.dto-in';
import { ListPaymentTransactionsByOfficeIdDtoOut } from './dtos/list-payment-transactions-by-office-id.dto-out';
export declare class ListPaymentTransactionsByOfficeIdUseCase {
    private readonly resolveActorAuthorizationService;
    private readonly getAllPaymentTransactionsByOfficeIdService;
    private readonly handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService: ResolveActorAuthorizationService, getAllPaymentTransactionsByOfficeIdService: GetAllPaymentTransactionsByOfficeIdService, handleUseCaseExceptionService: HandleUseCaseExceptionService);
    exec(dtoIn: ListPaymentTransactionsByOfficeIdDtoIn): Promise<ListPaymentTransactionsByOfficeIdDtoOut>;
}
