import type { ISplitRulesRepository } from '../../entities/split-rules-repository.interface';
import { GetAllSplitRulesDtoOut } from './dtos/get-all-split-rules.dto-out';
export declare class GetAllSplitRulesService {
    private readonly splitRulesRepository;
    constructor(splitRulesRepository: ISplitRulesRepository);
    exec(): Promise<GetAllSplitRulesDtoOut>;
}
