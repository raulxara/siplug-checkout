import { Inject, Injectable } from '@nestjs/common';

import type { ISplitRulesRepository } from '../../entities/split-rules-repository.interface';
import { SPLIT_RULES_REPOSITORY } from '../../tokens/split-rules.tokens';
import { FindSplitRuleByUniqueIdDtoIn } from './dtos/find-split-rule-by-unique-id.dto-in';
import { FindSplitRuleByUniqueIdDtoOut } from './dtos/find-split-rule-by-unique-id.dto-out';

@Injectable()
export class FindSplitRuleByUniqueIdService {
  constructor(
    @Inject(SPLIT_RULES_REPOSITORY)
    private readonly splitRulesRepository: ISplitRulesRepository,
  ) {}

  async exec(
    dtoIn: FindSplitRuleByUniqueIdDtoIn,
  ): Promise<FindSplitRuleByUniqueIdDtoOut> {
    const splitRule = await this.splitRulesRepository.findByUniqueId(
      dtoIn.splitRuleId,
    );

    if (splitRule === null) {
      throw new Error('split rule not found');
    }

    return new FindSplitRuleByUniqueIdDtoOut(splitRule);
  }
}
