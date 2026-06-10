import { Injectable } from '@nestjs/common';

import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { GetAllSplitRulesByOfficeIdDtoIn } from '../../modules/split-rules/services/get-all-split-rules-by-office-id/dtos/get-all-split-rules-by-office-id.dto-in';
import { GetAllSplitRulesByOfficeIdService } from '../../modules/split-rules/services/get-all-split-rules-by-office-id/get-all-split-rules-by-office-id.service';

import { ListSplitRulesByOfficeIdDtoIn } from './dtos/list-split-rules-by-office-id.dto-in';
import { ListSplitRulesByOfficeIdDtoOut } from './dtos/list-split-rules-by-office-id.dto-out';

@Injectable()
export class ListSplitRulesByOfficeIdUseCase {
  constructor(
    private readonly getAllSplitRulesByOfficeIdService: GetAllSplitRulesByOfficeIdService,
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,
  ) {}

  async exec(
    dtoIn: ListSplitRulesByOfficeIdDtoIn,
  ): Promise<ListSplitRulesByOfficeIdDtoOut> {
    await this.resolveActorAuthorizationService.exec({
      token: dtoIn.token,
      requiredEntity: 'splitRule',
      requiredAction: 'listSplitRulesByOfficeId',
    });

    const splitRulesDtoOut = await this.getAllSplitRulesByOfficeIdService.exec(
      new GetAllSplitRulesByOfficeIdDtoIn(dtoIn.officeId),
    );

    return new ListSplitRulesByOfficeIdDtoOut(splitRulesDtoOut.splitRules);
  }
}
