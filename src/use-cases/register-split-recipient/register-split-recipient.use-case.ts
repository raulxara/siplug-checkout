import { Injectable } from '@nestjs/common';

import { CreateSplitRecipientDtoIn } from '../../modules/split-recipients/services/create-split-recipient/dtos/create-split-recipient.dto-in';
import { CreateSplitRecipientService } from '../../modules/split-recipients/services/create-split-recipient/create-split-recipient.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';

import { RegisterSplitRecipientDtoIn } from './dtos/register-split-recipient.dto-in';
import { RegisterSplitRecipientDtoOut } from './dtos/register-split-recipient.dto-out';

@Injectable()
export class RegisterSplitRecipientUseCase {
  constructor(
    private readonly createSplitRecipientService: CreateSplitRecipientService,
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,
  ) {}

  async exec(
    dtoIn: RegisterSplitRecipientDtoIn,
  ): Promise<RegisterSplitRecipientDtoOut> {
    await this.resolveActorAuthorizationService.exec({
      token: dtoIn.token,
      requiredEntity: 'splitRecipient',
      requiredAction: 'registerSplitRecipient',
    });

    const splitRecipientDtoOut = await this.createSplitRecipientService.exec(
      new CreateSplitRecipientDtoIn(
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
      ),
    );

    return new RegisterSplitRecipientDtoOut(
      splitRecipientDtoOut.splitRecipient,
    );
  }
}
