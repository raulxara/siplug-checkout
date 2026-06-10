import type { ISplitRulesRepository } from '../../entities/split-rules-repository.interface';
import { FindSplitRuleByUniqueIdDtoIn } from './dtos/find-split-rule-by-unique-id.dto-in';
import { FindSplitRuleByUniqueIdDtoOut } from './dtos/find-split-rule-by-unique-id.dto-out';
export declare class FindSplitRuleByUniqueIdService {
    private readonly splitRulesRepository;
    constructor(splitRulesRepository: ISplitRulesRepository);
    exec(dtoIn: FindSplitRuleByUniqueIdDtoIn): Promise<FindSplitRuleByUniqueIdDtoOut>;
}
