import { Injectable } from '@nestjs/common';

import { FindSplitRecipientByUniqueIdDtoIn } from '../../modules/split-recipients/services/find-split-recipient-by-unique-id/dtos/find-split-recipient-by-unique-id.dto-in';
import { FindSplitRecipientByUniqueIdService } from '../../modules/split-recipients/services/find-split-recipient-by-unique-id/find-split-recipient-by-unique-id.service';
import { UpdateSplitRecipientDtoIn as UpdateSplitRecipientServiceDtoIn } from '../../modules/split-recipients/services/update-split-recipient/dtos/update-split-recipient.dto-in';
import { UpdateSplitRecipientService } from '../../modules/split-recipients/services/update-split-recipient/update-split-recipient.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';

import { UpdateSplitRecipientDtoIn } from './dtos/update-split-recipient.dto-in';
import { UpdateSplitRecipientDtoOut } from './dtos/update-split-recipient.dto-out';

@Injectable()
export class UpdateSplitRecipientUseCase {
  constructor(
    private readonly findSplitRecipientByUniqueIdService: FindSplitRecipientByUniqueIdService,
    private readonly updateSplitRecipientService: UpdateSplitRecipientService,
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,
  ) {}

  async exec(
    dtoIn: UpdateSplitRecipientDtoIn,
  ): Promise<UpdateSplitRecipientDtoOut> {
    await this.resolveActorAuthorizationService.exec({
      token: dtoIn.token,
      requiredEntity: 'splitRecipient',
      requiredAction: 'updateSplitRecipient',
    });

    await this.findSplitRecipientByUniqueIdService.exec(
      new FindSplitRecipientByUniqueIdDtoIn(dtoIn.splitRecipientId),
    );

    const splitRecipientDtoOut = await this.updateSplitRecipientService.exec(
      new UpdateSplitRecipientServiceDtoIn(
        dtoIn.splitRecipientId,

        dtoIn.officeId,
        dtoIn.clientId,
        dtoIn.gatewayId,
        dtoIn.apiCredentialId,

        dtoIn.name,
        dtoIn.documentType,
        dtoIn.documentValue,
        dtoIn.email,

        dtoIn.gatewayProvider,
        dtoIn.gatewayRecipientId,
        dtoIn.gatewayAccountId,

        dtoIn.bankData,
        dtoIn.metadata,
        dtoIn.config,

        dtoIn.status,
        'UpdateSplitRecipientUseCase',
      ),
    );

    return new UpdateSplitRecipientDtoOut(
      splitRecipientDtoOut.splitRecipient,
    );
  }
}
