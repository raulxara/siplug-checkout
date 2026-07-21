import { Inject, Injectable } from '@nestjs/common';

import { BuildChangesHistoryService } from '../../../../common/services/changes-history/build-changes-history.service';
import type { ISplitRecipientsRepository } from '../../entities/split-recipients-repository.interface';
import { SPLIT_RECIPIENTS_REPOSITORY } from '../../tokens/split-recipients.tokens';
import { UpdateSplitRecipientDtoIn } from './dtos/update-split-recipient.dto-in';
import { UpdateSplitRecipientDtoOut } from './dtos/update-split-recipient.dto-out';

@Injectable()
export class UpdateSplitRecipientService {
  constructor(
    @Inject(SPLIT_RECIPIENTS_REPOSITORY)
    private readonly splitRecipientsRepository: ISplitRecipientsRepository,

    private readonly buildChangesHistoryService: BuildChangesHistoryService,
  ) {}

  async exec(
    dtoIn: UpdateSplitRecipientDtoIn,
  ): Promise<UpdateSplitRecipientDtoOut> {
    const current = await this.splitRecipientsRepository.findByUniqueId(
      dtoIn._id,
    );

    if (current === null) {
      throw new Error('split recipient not found');
    }

    const newDataForHistory = this.buildNewDataForHistory(dtoIn);

    const changesHistory = this.buildChangesHistoryService.exec({
      currentChangesHistory: current.changesHistory ?? null,
      oldData: current as unknown as Record<string, unknown>,
      newData: newDataForHistory,
      source: dtoIn.source,
    });

    const updated = await this.splitRecipientsRepository.updateByUniqueId(
      dtoIn._id,
      {
        office_id: dtoIn.officeId,
        client_id: dtoIn.clientId,
        gateway_id: dtoIn.gatewayId,
        api_credential_id: dtoIn.apiCredentialId,

        name: dtoIn.name,
        document_type: dtoIn.documentType,
        document_value: dtoIn.documentValue,
        email: dtoIn.email,

        gateway_provider: dtoIn.gatewayProvider,
        gateway_recipient_id: dtoIn.gatewayRecipientId,
        gateway_account_id: dtoIn.gatewayAccountId,

        bank_data: dtoIn.bankData,
        metadata: dtoIn.metadata,
        config: dtoIn.config,

        changes_history: changesHistory,
        status: dtoIn.status,
      },
    );

    return new UpdateSplitRecipientDtoOut(
      updated as unknown as Record<string, unknown>,
    );
  }

  private buildNewDataForHistory(
    dtoIn: UpdateSplitRecipientDtoIn,
  ): Record<string, unknown> {
    const newData: Record<string, unknown> = {};

    this.addIfNotNull(newData, 'officeId', dtoIn.officeId);
    this.addIfNotNull(newData, 'clientId', dtoIn.clientId);
    this.addIfNotNull(newData, 'gatewayId', dtoIn.gatewayId);
    this.addIfNotNull(newData, 'apiCredentialId', dtoIn.apiCredentialId);

    this.addIfNotNull(newData, 'name', dtoIn.name);
    this.addIfNotNull(newData, 'documentType', dtoIn.documentType);
    this.addIfNotNull(newData, 'documentValue', dtoIn.documentValue);
    this.addIfNotNull(newData, 'email', dtoIn.email);

    this.addIfNotNull(newData, 'gatewayProvider', dtoIn.gatewayProvider);
    this.addIfNotNull(newData, 'gatewayRecipientId', dtoIn.gatewayRecipientId);
    this.addIfNotNull(newData, 'gatewayAccountId', dtoIn.gatewayAccountId);

    this.addIfNotNull(newData, 'bankData', dtoIn.bankData);
    this.addIfNotNull(newData, 'metadata', dtoIn.metadata);
    this.addIfNotNull(newData, 'config', dtoIn.config);

    this.addIfNotNull(newData, 'status', dtoIn.status);

    return newData;
  }

  private addIfNotNull(
    target: Record<string, unknown>,
    key: string,
    value: unknown,
  ): void {
    if (value !== null && value !== undefined) {
      target[key] = value;
    }
  }
}
