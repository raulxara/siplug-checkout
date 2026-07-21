import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { FindApiCredentialByUniqueIdService } from '../../modules/api-credentials/services/find-api-credential-by-unique-id/find-api-credential-by-unique-id.service';
import { FindClientByUniqueIdService } from '../../modules/clients/services/find-client-by-unique-id/find-client-by-unique-id.service';
import { DecryptApiCredentialSecretService } from '../../common/services/crypto/decrypt-api-credential-secret/decrypt-api-credential-secret.service';
import { DispatchGatewayPaymentService } from '../../modules/gateway-orchestration/services/dispatch-gateway-payment/dispatch-gateway-payment.service';
import { FindGatewayByUniqueIdService } from '../../modules/gateways/services/find-gateway-by-unique-id/find-gateway-by-unique-id.service';
import { FindOfficeByUniqueIdService } from '../../modules/offices/services/find-office-by-unique-id/find-office-by-unique-id.service';
import { FindPaymentTransactionByUniqueIdService } from '../../modules/payment-transactions/services/find-payment-transaction-by-unique-id/find-payment-transaction-by-unique-id.service';
import { UpdatePaymentTransactionService } from '../../modules/payment-transactions/services/update-payment-transaction/update-payment-transaction.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { DispatchPaymentTransactionToGatewayDtoIn } from './dtos/dispatch-payment-transaction-to-gateway.dto-in';
import { DispatchPaymentTransactionToGatewayDtoOut } from './dtos/dispatch-payment-transaction-to-gateway.dto-out';
export declare class DispatchPaymentTransactionToGatewayUseCase {
    private readonly resolveActorAuthorizationService;
    private readonly findPaymentTransactionByUniqueIdService;
    private readonly updatePaymentTransactionService;
    private readonly findOfficeByUniqueIdService;
    private readonly findClientByUniqueIdService;
    private readonly findGatewayByUniqueIdService;
    private readonly findApiCredentialByUniqueIdService;
    private readonly dispatchGatewayPaymentService;
    private readonly decryptApiCredentialSecretService;
    private readonly handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService: ResolveActorAuthorizationService, findPaymentTransactionByUniqueIdService: FindPaymentTransactionByUniqueIdService, updatePaymentTransactionService: UpdatePaymentTransactionService, findOfficeByUniqueIdService: FindOfficeByUniqueIdService, findClientByUniqueIdService: FindClientByUniqueIdService, findGatewayByUniqueIdService: FindGatewayByUniqueIdService, findApiCredentialByUniqueIdService: FindApiCredentialByUniqueIdService, dispatchGatewayPaymentService: DispatchGatewayPaymentService, decryptApiCredentialSecretService: DecryptApiCredentialSecretService, handleUseCaseExceptionService: HandleUseCaseExceptionService);
    exec(dtoIn: DispatchPaymentTransactionToGatewayDtoIn): Promise<DispatchPaymentTransactionToGatewayDtoOut>;
    private extractDecryptedTokenFromApiCredentialConfig;
}
