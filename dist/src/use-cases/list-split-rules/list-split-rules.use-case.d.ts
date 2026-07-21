import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { GetAllSplitRulesService } from '../../modules/split-rules/services/get-all-split-rules/get-all-split-rules.service';
import { ListSplitRulesDtoIn } from './dtos/list-split-rules.dto-in';
import { ListSplitRulesDtoOut } from './dtos/list-split-rules.dto-out';
export declare class ListSplitRulesUseCase {
    private readonly getAllSplitRulesService;
    private readonly resolveActorAuthorizationService;
    constructor(getAllSplitRulesService: GetAllSplitRulesService, resolveActorAuthorizationService: ResolveActorAuthorizationService);
    exec(dtoIn: ListSplitRulesDtoIn): Promise<ListSplitRulesDtoOut>;
}
