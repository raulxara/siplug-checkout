import { BuildChangesHistoryService } from '../../../../common/services/changes-history/build-changes-history.service';
import type { ISplitRuleRecipientsRepository } from '../../entities/split-rule-recipients-repository.interface';
import { UpdateSplitRuleRecipientDtoIn } from './dtos/update-split-rule-recipient.dto-in';
import { UpdateSplitRuleRecipientDtoOut } from './dtos/update-split-rule-recipient.dto-out';
export declare class UpdateSplitRuleRecipientService {
    private readonly splitRuleRecipientsRepository;
    private readonly buildChangesHistoryService;
    constructor(splitRuleRecipientsRepository: ISplitRuleRecipientsRepository, buildChangesHistoryService: BuildChangesHistoryService);
    exec(dtoIn: UpdateSplitRuleRecipientDtoIn): Promise<UpdateSplitRuleRecipientDtoOut>;
    private buildNewDataForHistory;
    private addIfNotNull;
}
