import { Injectable } from '@nestjs/common';

import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { GetAllSplitRulesService } from '../../modules/split-rules/services/get-all-split-rules/get-all-split-rules.service';

import { ListSplitRulesDtoIn } from './dtos/list-split-rules.dto-in';
import { ListSplitRulesDtoOut } from './dtos/list-split-rules.dto-out';

@Injectable()
export class ListSplitRulesUseCase {
  constructor(
    private readonly getAllSplitRulesService: GetAllSplitRulesService,
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,
  ) {}

  async exec(dtoIn: ListSplitRulesDtoIn): Promise<ListSplitRulesDtoOut> {
    await this.resolveActorAuthorizationService.exec({
      token: dtoIn.token,
      requiredEntity: 'splitRule',
      requiredAction: 'listSplitRules',
    });

    const splitRulesDtoOut = await this.getAllSplitRulesService.exec();

    return new ListSplitRulesDtoOut(splitRulesDtoOut.splitRules);
  }
}
