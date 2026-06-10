import type { ISplitRulesRepository } from '../../entities/split-rules-repository.interface';
import { CreateSplitRuleDtoIn } from './dtos/create-split-rule.dto-in';
import { CreateSplitRuleDtoOut } from './dtos/create-split-rule.dto-out';
export declare class CreateSplitRuleService {
    private readonly splitRulesRepository;
    constructor(splitRulesRepository: ISplitRulesRepository);
    exec(dtoIn: CreateSplitRuleDtoIn): Promise<CreateSplitRuleDtoOut>;
}
