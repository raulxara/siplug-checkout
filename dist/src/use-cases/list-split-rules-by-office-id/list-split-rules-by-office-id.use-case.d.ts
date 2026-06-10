import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { GetAllSplitRulesByOfficeIdService } from '../../modules/split-rules/services/get-all-split-rules-by-office-id/get-all-split-rules-by-office-id.service';
import { ListSplitRulesByOfficeIdDtoIn } from './dtos/list-split-rules-by-office-id.dto-in';
import { ListSplitRulesByOfficeIdDtoOut } from './dtos/list-split-rules-by-office-id.dto-out';
export declare class ListSplitRulesByOfficeIdUseCase {
    private readonly getAllSplitRulesByOfficeIdService;
    private readonly resolveActorAuthorizationService;
    constructor(getAllSplitRulesByOfficeIdService: GetAllSplitRulesByOfficeIdService, resolveActorAuthorizationService: ResolveActorAuthorizationService);
    exec(dtoIn: ListSplitRulesByOfficeIdDtoIn): Promise<ListSplitRulesByOfficeIdDtoOut>;
}
