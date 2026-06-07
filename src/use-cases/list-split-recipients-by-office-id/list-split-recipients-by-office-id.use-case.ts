import { Injectable } from '@nestjs/common';

import { GetAllSplitRecipientsByOfficeIdDtoIn } from '../../modules/split-recipients/services/get-all-split-recipients-by-office-id/dtos/get-all-split-recipients-by-office-id.dto-in';
import { GetAllSplitRecipientsByOfficeIdService } from '../../modules/split-recipients/services/get-all-split-recipients-by-office-id/get-all-split-recipients-by-office-id.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';

import { ListSplitRecipientsByOfficeIdDtoIn } from './dtos/list-split-recipients-by-office-id.dto-in';
import { ListSplitRecipientsByOfficeIdDtoOut } from './dtos/list-split-recipients-by-office-id.dto-out';

@Injectable()
export class ListSplitRecipientsByOfficeIdUseCase {
  constructor(
    private readonly getAllSplitRecipientsByOfficeIdService: GetAllSplitRecipientsByOfficeIdService,
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,
  ) {}

  async exec(
    dtoIn: ListSplitRecipientsByOfficeIdDtoIn,
  ): Promise<ListSplitRecipientsByOfficeIdDtoOut> {
    await this.resolveActorAuthorizationService.exec({
      token: dtoIn.token,
      requiredEntity: 'splitRecipient',
      requiredAction: 'listSplitRecipientsByOfficeId',
    });

    const splitRecipientsDtoOut =
      await this.getAllSplitRecipientsByOfficeIdService.exec(
        new GetAllSplitRecipientsByOfficeIdDtoIn(dtoIn.officeId),
      );

    return new ListSplitRecipientsByOfficeIdDtoOut(
      splitRecipientsDtoOut.splitRecipients,
    );
  }
}
