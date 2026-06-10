import { Injectable } from '@nestjs/common';

import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { FindSplitRuleByUniqueIdDtoIn } from '../../modules/split-rules/services/find-split-rule-by-unique-id/dtos/find-split-rule-by-unique-id.dto-in';
import { FindSplitRuleByUniqueIdService } from '../../modules/split-rules/services/find-split-rule-by-unique-id/find-split-rule-by-unique-id.service';

import { GetSplitRuleByUniqueIdDtoIn } from './dtos/get-split-rule-by-unique-id.dto-in';
import { GetSplitRuleByUniqueIdDtoOut } from './dtos/get-split-rule-by-unique-id.dto-out';

@Injectable()
export class GetSplitRuleByUniqueIdUseCase {
  constructor(
    private readonly findSplitRuleByUniqueIdService: FindSplitRuleByUniqueIdService,
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,
  ) {}

  async exec(
    dtoIn: GetSplitRuleByUniqueIdDtoIn,
  ): Promise<GetSplitRuleByUniqueIdDtoOut> {
    await this.resolveActorAuthorizationService.exec({
      token: dtoIn.token,
      requiredEntity: 'splitRule',
      requiredAction: 'getSplitRuleByUniqueId',
    });

    const splitRuleDtoOut = await this.findSplitRuleByUniqueIdService.exec(
      new FindSplitRuleByUniqueIdDtoIn(dtoIn.splitRuleId),
    );

    return new GetSplitRuleByUniqueIdDtoOut(splitRuleDtoOut.splitRule);
  }
}
