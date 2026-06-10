import { BuildChangesHistoryService } from '../../../../common/services/changes-history/build-changes-history.service';
import type { ISplitRulesRepository } from '../../entities/split-rules-repository.interface';
import { UpdateSplitRuleDtoIn } from './dtos/update-split-rule.dto-in';
import { UpdateSplitRuleDtoOut } from './dtos/update-split-rule.dto-out';
export declare class UpdateSplitRuleService {
    private readonly splitRulesRepository;
    private readonly buildChangesHistoryService;
    constructor(splitRulesRepository: ISplitRulesRepository, buildChangesHistoryService: BuildChangesHistoryService);
    exec(dtoIn: UpdateSplitRuleDtoIn): Promise<UpdateSplitRuleDtoOut>;
    private buildNewDataForHistory;
    private addIfNotNull;
}
