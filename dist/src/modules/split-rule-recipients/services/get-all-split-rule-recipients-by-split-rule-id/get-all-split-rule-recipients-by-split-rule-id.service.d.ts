import type { ISplitRuleRecipientsRepository } from '../../entities/split-rule-recipients-repository.interface';
import { GetAllSplitRuleRecipientsBySplitRuleIdDtoIn } from './dtos/get-all-split-rule-recipients-by-split-rule-id.dto-in';
import { GetAllSplitRuleRecipientsBySplitRuleIdDtoOut } from './dtos/get-all-split-rule-recipients-by-split-rule-id.dto-out';
export declare class GetAllSplitRuleRecipientsBySplitRuleIdService {
    private readonly splitRuleRecipientsRepository;
    constructor(splitRuleRecipientsRepository: ISplitRuleRecipientsRepository);
    exec(dtoIn: GetAllSplitRuleRecipientsBySplitRuleIdDtoIn): Promise<GetAllSplitRuleRecipientsBySplitRuleIdDtoOut>;
}
