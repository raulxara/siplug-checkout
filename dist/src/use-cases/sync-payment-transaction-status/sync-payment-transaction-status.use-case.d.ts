import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { UpdateCheckoutSessionService } from '../../modules/checkout-sessions/services/update-checkout-session/update-checkout-session.service';
import { ResolvePaymentGatewayCredentialService } from '../../modules/gateway-orchestration/services/resolve-payment-gateway-credential/resolve-payment-gateway-credential.service';
import { SyncGatewayPaymentStatusService } from '../../modules/gateway-orchestration/services/sync-gateway-payment-status/sync-gateway-payment-status.service';
import { FindPaymentTransactionByUniqueIdService } from '../../modules/payment-transactions/services/find-payment-transaction-by-unique-id/find-payment-transaction-by-unique-id.service';
import { UpdatePaymentTransactionService } from '../../modules/payment-transactions/services/update-payment-transaction/update-payment-transaction.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { SyncPaymentTransactionStatusDtoIn } from './dtos/sync-payment-transaction-status.dto-in';
import { SyncPaymentTransactionStatusDtoOut } from './dtos/sync-payment-transaction-status.dto-out';
export declare class SyncPaymentTransactionStatusUseCase {
    private readonly resolveActorAuthorizationService;
    private readonly findPaymentTransactionByUniqueIdService;
    private readonly updatePaymentTransactionService;
    private readonly updateCheckoutSessionService;
    private readonly resolvePaymentGatewayCredentialService;
    private readonly syncGatewayPaymentStatusService;
    private readonly handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService: ResolveActorAuthorizationService, findPaymentTransactionByUniqueIdService: FindPaymentTransactionByUniqueIdService, updatePaymentTransactionService: UpdatePaymentTransactionService, updateCheckoutSessionService: UpdateCheckoutSessionService, resolvePaymentGatewayCredentialService: ResolvePaymentGatewayCredentialService, syncGatewayPaymentStatusService: SyncGatewayPaymentStatusService, handleUseCaseExceptionService: HandleUseCaseExceptionService);
    exec(dtoIn: SyncPaymentTransactionStatusDtoIn): Promise<SyncPaymentTransactionStatusDtoOut>;
    private isFinalStatus;
    private resolveCheckoutSessionStatus;
    private sanitizeSensitiveGatewayData;
    private sanitizeUnknownGatewayValue;
    private isSensitiveGatewayKey;
}
