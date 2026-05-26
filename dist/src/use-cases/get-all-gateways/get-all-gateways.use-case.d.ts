import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { GetAllGatewaysService } from '../../modules/gateways/services/get-all-gateways/get-all-gateways.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { GetAllGatewaysDtoIn } from './dtos/get-all-gateways.dto-in';
import { GetAllGatewaysDtoOut } from './dtos/get-all-gateways.dto-out';
export declare class GetAllGatewaysUseCase {
    private readonly resolveActorAuthorizationService;
    private readonly getAllGatewaysService;
    private readonly handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService: ResolveActorAuthorizationService, getAllGatewaysService: GetAllGatewaysService, handleUseCaseExceptionService: HandleUseCaseExceptionService);
    exec(dtoIn: GetAllGatewaysDtoIn): Promise<GetAllGatewaysDtoOut>;
    private matchesSearch;
}
