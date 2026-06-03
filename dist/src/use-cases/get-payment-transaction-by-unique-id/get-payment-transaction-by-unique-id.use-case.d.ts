import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { FindPaymentTransactionByUniqueIdService } from '../../modules/payment-transactions/services/find-payment-transaction-by-unique-id/find-payment-transaction-by-unique-id.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { GetPaymentTransactionByUniqueIdDtoIn } from './dtos/get-payment-transaction-by-unique-id.dto-in';
import { GetPaymentTransactionByUniqueIdDtoOut } from './dtos/get-payment-transaction-by-unique-id.dto-out';
export declare class GetPaymentTransactionByUniqueIdUseCase {
    private readonly resolveActorAuthorizationService;
    private readonly findPaymentTransactionByUniqueIdService;
    private readonly handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService: ResolveActorAuthorizationService, findPaymentTransactionByUniqueIdService: FindPaymentTransactionByUniqueIdService, handleUseCaseExceptionService: HandleUseCaseExceptionService);
    exec(dtoIn: GetPaymentTransactionByUniqueIdDtoIn): Promise<GetPaymentTransactionByUniqueIdDtoOut>;
}
