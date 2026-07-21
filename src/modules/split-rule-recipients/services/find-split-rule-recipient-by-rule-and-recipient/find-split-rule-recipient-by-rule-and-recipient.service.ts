import { Inject, Injectable } from '@nestjs/common';

import type { ISplitRuleRecipientsRepository } from '../../entities/split-rule-recipients-repository.interface';
import { SPLIT_RULE_RECIPIENTS_REPOSITORY } from '../../tokens/split-rule-recipients.tokens';
import { FindSplitRuleRecipientByRuleAndRecipientDtoIn } from './dtos/find-split-rule-recipient-by-rule-and-recipient.dto-in';
import { FindSplitRuleRecipientByRuleAndRecipientDtoOut } from './dtos/find-split-rule-recipient-by-rule-and-recipient.dto-out';

@Injectable()
export class FindSplitRuleRecipientByRuleAndRecipientService {
  constructor(
    @Inject(SPLIT_RULE_RECIPIENTS_REPOSITORY)
    private readonly splitRuleRecipientsRepository: ISplitRuleRecipientsRepository,
  ) {}

  async exec(
    dtoIn: FindSplitRuleRecipientByRuleAndRecipientDtoIn,
  ): Promise<FindSplitRuleRecipientByRuleAndRecipientDtoOut> {
    const splitRuleRecipient =
      await this.splitRuleRecipientsRepository.findByRuleIdAndRecipientId(
        dtoIn.splitRuleId,
        dtoIn.splitRecipientId,
      );

    return new FindSplitRuleRecipientByRuleAndRecipientDtoOut(
      splitRuleRecipient as unknown as Record<string, unknown> | null,
    );
  }
}
