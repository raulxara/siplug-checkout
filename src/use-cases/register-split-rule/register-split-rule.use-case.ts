import { Injectable } from '@nestjs/common';

import { CreateSplitRuleDtoIn } from '../../modules/split-rules/services/create-split-rule/dtos/create-split-rule.dto-in';
import { CreateSplitRuleService } from '../../modules/split-rules/services/create-split-rule/create-split-rule.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';

import { RegisterSplitRuleDtoIn } from './dtos/register-split-rule.dto-in';
import { RegisterSplitRuleDtoOut } from './dtos/register-split-rule.dto-out';

@Injectable()
export class RegisterSplitRuleUseCase {
  constructor(
    private readonly createSplitRuleService: CreateSplitRuleService,
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,
  ) {}

  async exec(
    dtoIn: RegisterSplitRuleDtoIn,
  ): Promise<RegisterSplitRuleDtoOut> {
    await this.resolveActorAuthorizationService.exec({
      token: dtoIn.token,
      requiredEntity: 'splitRule',
      requiredAction: 'registerSplitRule',
    });

    const splitRuleDtoOut = await this.createSplitRuleService.exec(
      new CreateSplitRuleDtoIn(
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
      ),
    );

    return new RegisterSplitRuleDtoOut(splitRuleDtoOut.splitRule);
  }
}
