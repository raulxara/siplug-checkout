import type { ISplitRuleRecipientsRepository } from '../../entities/split-rule-recipients-repository.interface';
import { CreateSplitRuleRecipientDtoIn } from './dtos/create-split-rule-recipient.dto-in';
import { CreateSplitRuleRecipientDtoOut } from './dtos/create-split-rule-recipient.dto-out';
export declare class CreateSplitRuleRecipientService {
    private readonly splitRuleRecipientsRepository;
    constructor(splitRuleRecipientsRepository: ISplitRuleRecipientsRepository);
    exec(dtoIn: CreateSplitRuleRecipientDtoIn): Promise<CreateSplitRuleRecipientDtoOut>;
}
