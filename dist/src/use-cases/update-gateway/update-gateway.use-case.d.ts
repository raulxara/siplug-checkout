import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { FindGatewayByUniqueIdService } from '../../modules/gateways/services/find-gateway-by-unique-id/find-gateway-by-unique-id.service';
import { UpdateGatewayService } from '../../modules/gateways/services/update-gateway/update-gateway.service';
import { ValidateGatewaySlugUniquenessService } from '../../modules/gateways/services/validate-gateway-slug-uniqueness/validate-gateway-slug-uniqueness.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { UpdateGatewayDtoIn } from './dtos/update-gateway.dto-in';
import { UpdateGatewayDtoOut } from './dtos/update-gateway.dto-out';
export declare class UpdateGatewayUseCase {
    private readonly resolveActorAuthorizationService;
    private readonly findGatewayByUniqueIdService;
    private readonly validateGatewaySlugUniquenessService;
    private readonly updateGatewayService;
    private readonly handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService: ResolveActorAuthorizationService, findGatewayByUniqueIdService: FindGatewayByUniqueIdService, validateGatewaySlugUniquenessService: ValidateGatewaySlugUniquenessService, updateGatewayService: UpdateGatewayService, handleUseCaseExceptionService: HandleUseCaseExceptionService);
    exec(dtoIn: UpdateGatewayDtoIn): Promise<UpdateGatewayDtoOut>;
}
