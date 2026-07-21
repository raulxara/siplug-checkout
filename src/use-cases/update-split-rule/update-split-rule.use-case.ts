import { Injectable } from '@nestjs/common';

import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { FindSplitRuleByUniqueIdDtoIn } from '../../modules/split-rules/services/find-split-rule-by-unique-id/dtos/find-split-rule-by-unique-id.dto-in';
import { FindSplitRuleByUniqueIdService } from '../../modules/split-rules/services/find-split-rule-by-unique-id/find-split-rule-by-unique-id.service';
import { UpdateSplitRuleDtoIn as UpdateSplitRuleServiceDtoIn } from '../../modules/split-rules/services/update-split-rule/dtos/update-split-rule.dto-in';
import { UpdateSplitRuleService } from '../../modules/split-rules/services/update-split-rule/update-split-rule.service';

import { UpdateSplitRuleDtoIn } from './dtos/update-split-rule.dto-in';
import { UpdateSplitRuleDtoOut } from './dtos/update-split-rule.dto-out';

@Injectable()
export class UpdateSplitRuleUseCase {
  constructor(
    private readonly findSplitRuleByUniqueIdService: FindSplitRuleByUniqueIdService,
    private readonly updateSplitRuleService: UpdateSplitRuleService,
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,
  ) {}

  async exec(dtoIn: UpdateSplitRuleDtoIn): Promise<UpdateSplitRuleDtoOut> {
    await this.resolveActorAuthorizationService.exec({
      token: dtoIn.token,
      requiredEntity: 'splitRule',
      requiredAction: 'updateSplitRule',
    });

    await this.findSplitRuleByUniqueIdService.exec(
      new FindSplitRuleByUniqueIdDtoIn(dtoIn.splitRuleId),
    );

    const splitRuleDtoOut = await this.updateSplitRuleService.exec(
      new UpdateSplitRuleServiceDtoIn(
        dtoIn.splitRuleId,

        dtoIn.officeId,
        dtoIn.clientId,
        dtoIn.gatewayId,

        dtoIn.name,
        dtoIn.slug,
        dtoIn.description,
        dtoIn.splitType,
        dtoIn.calculationBase,
        dtoIn.priority,

        dtoIn.metadata,
        dtoIn.config,

        dtoIn.status,
        'UpdateSplitRuleUseCase',
      ),
    );

    return new UpdateSplitRuleDtoOut(splitRuleDtoOut.splitRule);
  }
}
