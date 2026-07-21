import { FindUserCustomerByTokenService } from '../../../user-customers/services/find-user-customer-by-token/find-user-customer-by-token.service';
import { CheckUserPermissionService } from '../check-user-permission/check-user-permission.service';
import { ResolveActorAuthorizationDtoIn } from './dtos/resolve-actor-authorization.dto-in';
import { ResolveActorAuthorizationDtoOut } from './dtos/resolve-actor-authorization.dto-out';
export declare class ResolveActorAuthorizationService {
    private readonly findUserCustomerByTokenService;
    private readonly checkUserPermissionService;
    constructor(findUserCustomerByTokenService: FindUserCustomerByTokenService, checkUserPermissionService: CheckUserPermissionService);
    exec(dtoIn: ResolveActorAuthorizationDtoIn): Promise<ResolveActorAuthorizationDtoOut>;
}
