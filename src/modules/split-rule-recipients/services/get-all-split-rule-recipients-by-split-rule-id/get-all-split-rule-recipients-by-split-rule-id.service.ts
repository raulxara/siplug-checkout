import { Inject, Injectable } from '@nestjs/common';

import type { ISplitRuleRecipientsRepository } from '../../entities/split-rule-recipients-repository.interface';
import { SPLIT_RULE_RECIPIENTS_REPOSITORY } from '../../tokens/split-rule-recipients.tokens';
import { GetAllSplitRuleRecipientsBySplitRuleIdDtoIn } from './dtos/get-all-split-rule-recipients-by-split-rule-id.dto-in';
import { GetAllSplitRuleRecipientsBySplitRuleIdDtoOut } from './dtos/get-all-split-rule-recipients-by-split-rule-id.dto-out';

@Injectable()
export class GetAllSplitRuleRecipientsBySplitRuleIdService {
  constructor(
    @Inject(SPLIT_RULE_RECIPIENTS_REPOSITORY)
    private readonly splitRuleRecipientsRepository: ISplitRuleRecipientsRepository,
  ) {}

  async exec(
    dtoIn: GetAllSplitRuleRecipientsBySplitRuleIdDtoIn,
  ): Promise<GetAllSplitRuleRecipientsBySplitRuleIdDtoOut> {
    const splitRuleRecipients =
      await this.splitRuleRecipientsRepository.getAllBySplitRuleId(
        dtoIn.splitRuleId,
      );

    return new GetAllSplitRuleRecipientsBySplitRuleIdDtoOut(
      splitRuleRecipients as unknown as Array<Record<string, unknown>>,
    );
  }
}
