import type { ISplitRulesRepository } from '../../entities/split-rules-repository.interface';
import { GetAllSplitRulesByOfficeIdDtoIn } from './dtos/get-all-split-rules-by-office-id.dto-in';
import { GetAllSplitRulesByOfficeIdDtoOut } from './dtos/get-all-split-rules-by-office-id.dto-out';
export declare class GetAllSplitRulesByOfficeIdService {
    private readonly splitRulesRepository;
    constructor(splitRulesRepository: ISplitRulesRepository);
    exec(dtoIn: GetAllSplitRulesByOfficeIdDtoIn): Promise<GetAllSplitRulesByOfficeIdDtoOut>;
}
