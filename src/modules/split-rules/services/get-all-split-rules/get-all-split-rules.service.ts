import { Inject, Injectable } from '@nestjs/common';

import type { ISplitRulesRepository } from '../../entities/split-rules-repository.interface';
import { SPLIT_RULES_REPOSITORY } from '../../tokens/split-rules.tokens';
import { GetAllSplitRulesDtoOut } from './dtos/get-all-split-rules.dto-out';

@Injectable()
export class GetAllSplitRulesService {
  constructor(
    @Inject(SPLIT_RULES_REPOSITORY)
    private readonly splitRulesRepository: ISplitRulesRepository,
  ) {}

  async exec(): Promise<GetAllSplitRulesDtoOut> {
    const splitRules = await this.splitRulesRepository.getAll();

    return new GetAllSplitRulesDtoOut(
      splitRules as unknown as Array<Record<string, unknown>>,
    );
  }
}
