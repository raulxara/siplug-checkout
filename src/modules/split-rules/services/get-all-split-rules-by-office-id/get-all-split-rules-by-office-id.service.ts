import { Inject, Injectable } from '@nestjs/common';

import type { ISplitRulesRepository } from '../../entities/split-rules-repository.interface';
import { SPLIT_RULES_REPOSITORY } from '../../tokens/split-rules.tokens';
import { GetAllSplitRulesByOfficeIdDtoIn } from './dtos/get-all-split-rules-by-office-id.dto-in';
import { GetAllSplitRulesByOfficeIdDtoOut } from './dtos/get-all-split-rules-by-office-id.dto-out';

@Injectable()
export class GetAllSplitRulesByOfficeIdService {
  constructor(
    @Inject(SPLIT_RULES_REPOSITORY)
    private readonly splitRulesRepository: ISplitRulesRepository,
  ) {}

  async exec(
    dtoIn: GetAllSplitRulesByOfficeIdDtoIn,
  ): Promise<GetAllSplitRulesByOfficeIdDtoOut> {
    const splitRules = await this.splitRulesRepository.getAllByOfficeId(
      dtoIn.officeId,
    );

    return new GetAllSplitRulesByOfficeIdDtoOut(
      splitRules as unknown as Array<Record<string, unknown>>,
    );
  }
}
