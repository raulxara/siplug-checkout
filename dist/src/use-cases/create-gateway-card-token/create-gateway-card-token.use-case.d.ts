import { FindApiCredentialByUniqueIdService } from '../../modules/api-credentials/services/find-api-credential-by-unique-id/find-api-credential-by-unique-id.service';
import { CreateGatewayCardTokenDtoIn } from './dtos/create-gateway-card-token.dto-in';
import { CreateGatewayCardTokenDtoOut } from './dtos/create-gateway-card-token.dto-out';
export declare class CreateGatewayCardTokenUseCase {
    private readonly findApiCredentialByUniqueIdService;
    constructor(findApiCredentialByUniqueIdService: FindApiCredentialByUniqueIdService);
    exec(dtoIn: CreateGatewayCardTokenDtoIn): Promise<CreateGatewayCardTokenDtoOut>;
    private ensureNonProductionEnvironment;
    private resolvePublicKey;
    private extractMercadoPagoErrorMessage;
    private maskPublicKey;
    private toNullableString;
    private toNullableNumber;
}
