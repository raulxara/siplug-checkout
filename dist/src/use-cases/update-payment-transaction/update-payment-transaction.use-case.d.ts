import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { UpdatePaymentTransactionService } from '../../modules/payment-transactions/services/update-payment-transaction/update-payment-transaction.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { UpdatePaymentTransactionUseCaseDtoIn } from './dtos/update-payment-transaction.dto-in';
import { UpdatePaymentTransactionUseCaseDtoOut } from './dtos/update-payment-transaction.dto-out';
export declare class UpdatePaymentTransactionUseCase {
    private readonly resolveActorAuthorizationService;
    private readonly updatePaymentTransactionService;
    private readonly handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService: ResolveActorAuthorizationService, updatePaymentTransactionService: UpdatePaymentTransactionService, handleUseCaseExceptionService: HandleUseCaseExceptionService);
    exec(dtoIn: UpdatePaymentTransactionUseCaseDtoIn): Promise<UpdatePaymentTransactionUseCaseDtoOut>;
    private validateAllowedStatus;
    private validateAllowedProcessStatus;
    private assertNoSensitiveFields;
}
