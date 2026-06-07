import { Inject, Injectable } from '@nestjs/common';

import { SplitRecipientEntity } from '../../entities/split-recipient.entity';
import type { ISplitRecipientsRepository } from '../../entities/split-recipients-repository.interface';
import { SPLIT_RECIPIENTS_REPOSITORY } from '../../tokens/split-recipients.tokens';
import { CreateSplitRecipientDtoIn } from './dtos/create-split-recipient.dto-in';
import { CreateSplitRecipientDtoOut } from './dtos/create-split-recipient.dto-out';

@Injectable()
export class CreateSplitRecipientService {
  constructor(
    @Inject(SPLIT_RECIPIENTS_REPOSITORY)
    private readonly splitRecipientsRepository: ISplitRecipientsRepository,
  ) {}

  async exec(
    dtoIn: CreateSplitRecipientDtoIn,
  ): Promise<CreateSplitRecipientDtoOut> {
    const entity = new SplitRecipientEntity(this.splitRecipientsRepository);

    entity.officeId = dtoIn.officeId;
    entity.clientId = dtoIn.clientId;
    entity.gatewayId = dtoIn.gatewayId;
    entity.apiCredentialId = dtoIn.apiCredentialId;

    entity.name = dtoIn.name;
    entity.documentType = dtoIn.documentType;
    entity.documentValue = dtoIn.documentValue;
    entity.email = dtoIn.email;

    entity.gatewayProvider = dtoIn.gatewayProvider;
    entity.gatewayRecipientId = dtoIn.gatewayRecipientId;
    entity.gatewayAccountId = dtoIn.gatewayAccountId;

    entity.bankData = dtoIn.bankData;
    entity.metadata = dtoIn.metadata;
    entity.config = dtoIn.config;

    entity.changesHistory = [
      {
        source: 'CreateSplitRecipientService',
        action: 'created',
        createdAt: new Date().toISOString(),
      },
    ];

    entity.status = dtoIn.status ?? 'active';

    const created = await entity.create();

    return new CreateSplitRecipientDtoOut({
      id: created.id,
      _id: created._id,

      officeId: created.officeId,
      clientId: created.clientId,
      gatewayId: created.gatewayId,
      apiCredentialId: created.apiCredentialId,

      name: created.name,
      documentType: created.documentType,
      documentValue: created.documentValue,
      email: created.email,

      gatewayProvider: created.gatewayProvider,
      gatewayRecipientId: created.gatewayRecipientId,
      gatewayAccountId: created.gatewayAccountId,

      bankData: created.bankData,
      metadata: created.metadata,
      config: created.config,
      changesHistory: created.changesHistory,

      status: created.status,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    });
  }
}