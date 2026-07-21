import { CreateSplitRuleService } from '../../modules/split-rules/services/create-split-rule/create-split-rule.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { RegisterSplitRuleDtoIn } from './dtos/register-split-rule.dto-in';
import { RegisterSplitRuleDtoOut } from './dtos/register-split-rule.dto-out';
export declare class RegisterSplitRuleUseCase {
    private readonly createSplitRuleService;
    private readonly resolveActorAuthorizationService;
    constructor(createSplitRuleService: CreateSplitRuleService, resolveActorAuthorizationService: ResolveActorAuthorizationService);
    exec(dtoIn: RegisterSplitRuleDtoIn): Promise<RegisterSplitRuleDtoOut>;
}
