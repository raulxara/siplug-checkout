import { Injectable } from '@nestjs/common';

import { GetAllSplitRecipientsService } from '../../modules/split-recipients/services/get-all-split-recipients/get-all-split-recipients.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';

import { ListSplitRecipientsDtoIn } from './dtos/list-split-recipients.dto-in';
import { ListSplitRecipientsDtoOut } from './dtos/list-split-recipients.dto-out';

@Injectable()
export class ListSplitRecipientsUseCase {
  constructor(
    private readonly getAllSplitRecipientsService: GetAllSplitRecipientsService,
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,
  ) {}

  async exec(
    dtoIn: ListSplitRecipientsDtoIn,
  ): Promise<ListSplitRecipientsDtoOut> {
    await this.resolveActorAuthorizationService.exec({
      token: dtoIn.token,
      requiredEntity: 'splitRecipient',
      requiredAction: 'listSplitRecipients',
    });

    const splitRecipientsDtoOut =
      await this.getAllSplitRecipientsService.exec();

    return new ListSplitRecipientsDtoOut(
      splitRecipientsDtoOut.splitRecipients,
    );
  }
}
