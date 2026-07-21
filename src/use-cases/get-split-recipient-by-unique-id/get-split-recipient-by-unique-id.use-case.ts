import { Injectable } from '@nestjs/common';

import { FindSplitRecipientByUniqueIdDtoIn } from '../../modules/split-recipients/services/find-split-recipient-by-unique-id/dtos/find-split-recipient-by-unique-id.dto-in';
import { FindSplitRecipientByUniqueIdService } from '../../modules/split-recipients/services/find-split-recipient-by-unique-id/find-split-recipient-by-unique-id.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';

import { GetSplitRecipientByUniqueIdDtoIn } from './dtos/get-split-recipient-by-unique-id.dto-in';
import { GetSplitRecipientByUniqueIdDtoOut } from './dtos/get-split-recipient-by-unique-id.dto-out';

@Injectable()
export class GetSplitRecipientByUniqueIdUseCase {
  constructor(
    private readonly findSplitRecipientByUniqueIdService: FindSplitRecipientByUniqueIdService,
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,
  ) {}

  async exec(
    dtoIn: GetSplitRecipientByUniqueIdDtoIn,
  ): Promise<GetSplitRecipientByUniqueIdDtoOut> {
    await this.resolveActorAuthorizationService.exec({
      token: dtoIn.token,
      requiredEntity: 'splitRecipient',
      requiredAction: 'getSplitRecipientByUniqueId',
    });

    const splitRecipientDtoOut =
      await this.findSplitRecipientByUniqueIdService.exec(
        new FindSplitRecipientByUniqueIdDtoIn(dtoIn.splitRecipientId),
      );

    return new GetSplitRecipientByUniqueIdDtoOut(
      splitRecipientDtoOut.splitRecipient,
    );
  }
}
