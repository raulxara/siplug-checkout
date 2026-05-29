import { DecryptApiCredentialSecretService } from '../../../../common/services/crypto/decrypt-api-credential-secret/decrypt-api-credential-secret.service';
import type { IApiCredentialsRepository } from '../../../api-credentials/entities/api-credentials-repository.interface';
import { FindGatewayByUniqueIdService } from '../../../gateways/services/find-gateway-by-unique-id/find-gateway-by-unique-id.service';
import { ResolvePaymentGatewayCredentialDtoIn } from './dtos/resolve-payment-gateway-credential.dto-in';
import { ResolvePaymentGatewayCredentialDtoOut } from './dtos/resolve-payment-gateway-credential.dto-out';
export declare class ResolvePaymentGatewayCredentialService {
    private readonly apiCredentialsRepository;
    private readonly findGatewayByUniqueIdService;
    private readonly decryptApiCredentialSecretService;
    constructor(apiCredentialsRepository: IApiCredentialsRepository, findGatewayByUniqueIdService: FindGatewayByUniqueIdService, decryptApiCredentialSecretService: DecryptApiCredentialSecretService);
    exec(dtoIn: ResolvePaymentGatewayCredentialDtoIn): Promise<ResolvePaymentGatewayCredentialDtoOut>;
    private credentialSupportsPaymentContext;
    private gatewaySupportsPaymentContext;
    private decryptProviderToken;
    private providerRequiresToken;
    private normalizeProvider;
    private resolvePriority;
    private resolveIsDefault;
    private asStringArray;
}
