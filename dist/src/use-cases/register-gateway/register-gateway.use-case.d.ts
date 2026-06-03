import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { CreateGatewayService } from '../../modules/gateways/services/create-gateway/create-gateway.service';
import { ValidateGatewaySlugUniquenessService } from '../../modules/gateways/services/validate-gateway-slug-uniqueness/validate-gateway-slug-uniqueness.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { RegisterGatewayDtoIn } from './dtos/register-gateway.dto-in';
import { RegisterGatewayDtoOut } from './dtos/register-gateway.dto-out';
export declare class RegisterGatewayUseCase {
    private readonly resolveActorAuthorizationService;
    private readonly validateGatewaySlugUniquenessService;
    private readonly createGatewayService;
    private readonly handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService: ResolveActorAuthorizationService, validateGatewaySlugUniquenessService: ValidateGatewaySlugUniquenessService, createGatewayService: CreateGatewayService, handleUseCaseExceptionService: HandleUseCaseExceptionService);
    exec(dtoIn: RegisterGatewayDtoIn): Promise<RegisterGatewayDtoOut>;
}
