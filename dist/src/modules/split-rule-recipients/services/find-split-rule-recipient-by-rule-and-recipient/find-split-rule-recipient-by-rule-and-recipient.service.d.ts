import type { ISplitRuleRecipientsRepository } from '../../entities/split-rule-recipients-repository.interface';
import { FindSplitRuleRecipientByRuleAndRecipientDtoIn } from './dtos/find-split-rule-recipient-by-rule-and-recipient.dto-in';
import { FindSplitRuleRecipientByRuleAndRecipientDtoOut } from './dtos/find-split-rule-recipient-by-rule-and-recipient.dto-out';
export declare class FindSplitRuleRecipientByRuleAndRecipientService {
    private readonly splitRuleRecipientsRepository;
    constructor(splitRuleRecipientsRepository: ISplitRuleRecipientsRepository);
    exec(dtoIn: FindSplitRuleRecipientByRuleAndRecipientDtoIn): Promise<FindSplitRuleRecipientByRuleAndRecipientDtoOut>;
}
