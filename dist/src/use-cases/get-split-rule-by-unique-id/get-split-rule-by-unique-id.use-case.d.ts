import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { FindSplitRuleByUniqueIdService } from '../../modules/split-rules/services/find-split-rule-by-unique-id/find-split-rule-by-unique-id.service';
import { GetSplitRuleByUniqueIdDtoIn } from './dtos/get-split-rule-by-unique-id.dto-in';
import { GetSplitRuleByUniqueIdDtoOut } from './dtos/get-split-rule-by-unique-id.dto-out';
export declare class GetSplitRuleByUniqueIdUseCase {
    private readonly findSplitRuleByUniqueIdService;
    private readonly resolveActorAuthorizationService;
    constructor(findSplitRuleByUniqueIdService: FindSplitRuleByUniqueIdService, resolveActorAuthorizationService: ResolveActorAuthorizationService);
    exec(dtoIn: GetSplitRuleByUniqueIdDtoIn): Promise<GetSplitRuleByUniqueIdDtoOut>;
}
