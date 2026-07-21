import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { FindSplitRuleByUniqueIdService } from '../../modules/split-rules/services/find-split-rule-by-unique-id/find-split-rule-by-unique-id.service';
import { UpdateSplitRuleService } from '../../modules/split-rules/services/update-split-rule/update-split-rule.service';
import { UpdateSplitRuleDtoIn } from './dtos/update-split-rule.dto-in';
import { UpdateSplitRuleDtoOut } from './dtos/update-split-rule.dto-out';
export declare class UpdateSplitRuleUseCase {
    private readonly findSplitRuleByUniqueIdService;
    private readonly updateSplitRuleService;
    private readonly resolveActorAuthorizationService;
    constructor(findSplitRuleByUniqueIdService: FindSplitRuleByUniqueIdService, updateSplitRuleService: UpdateSplitRuleService, resolveActorAuthorizationService: ResolveActorAuthorizationService);
    exec(dtoIn: UpdateSplitRuleDtoIn): Promise<UpdateSplitRuleDtoOut>;
}
