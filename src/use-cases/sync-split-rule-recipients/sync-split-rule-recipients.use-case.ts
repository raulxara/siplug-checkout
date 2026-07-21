import { Injectable } from '@nestjs/common';

import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { FindSplitRecipientByUniqueIdDtoIn } from '../../modules/split-recipients/services/find-split-recipient-by-unique-id/dtos/find-split-recipient-by-unique-id.dto-in';
import { FindSplitRecipientByUniqueIdService } from '../../modules/split-recipients/services/find-split-recipient-by-unique-id/find-split-recipient-by-unique-id.service';
import { FindSplitRuleByUniqueIdDtoIn } from '../../modules/split-rules/services/find-split-rule-by-unique-id/dtos/find-split-rule-by-unique-id.dto-in';
import { FindSplitRuleByUniqueIdService } from '../../modules/split-rules/services/find-split-rule-by-unique-id/find-split-rule-by-unique-id.service';
import { CreateSplitRuleRecipientDtoIn } from '../../modules/split-rule-recipients/services/create-split-rule-recipient/dtos/create-split-rule-recipient.dto-in';
import { CreateSplitRuleRecipientService } from '../../modules/split-rule-recipients/services/create-split-rule-recipient/create-split-rule-recipient.service';
import { FindSplitRuleRecipientByRuleAndRecipientDtoIn } from '../../modules/split-rule-recipients/services/find-split-rule-recipient-by-rule-and-recipient/dtos/find-split-rule-recipient-by-rule-and-recipient.dto-in';
import { FindSplitRuleRecipientByRuleAndRecipientService } from '../../modules/split-rule-recipients/services/find-split-rule-recipient-by-rule-and-recipient/find-split-rule-recipient-by-rule-and-recipient.service';
import { GetAllSplitRuleRecipientsBySplitRuleIdDtoIn } from '../../modules/split-rule-recipients/services/get-all-split-rule-recipients-by-split-rule-id/dtos/get-all-split-rule-recipients-by-split-rule-id.dto-in';
import { GetAllSplitRuleRecipientsBySplitRuleIdService } from '../../modules/split-rule-recipients/services/get-all-split-rule-recipients-by-split-rule-id/get-all-split-rule-recipients-by-split-rule-id.service';
import { UpdateSplitRuleRecipientDtoIn } from '../../modules/split-rule-recipients/services/update-split-rule-recipient/dtos/update-split-rule-recipient.dto-in';
import { UpdateSplitRuleRecipientService } from '../../modules/split-rule-recipients/services/update-split-rule-recipient/update-split-rule-recipient.service';

import {
  SyncSplitRuleRecipientItemDtoIn,
  SyncSplitRuleRecipientsDtoIn,
} from './dtos/sync-split-rule-recipients.dto-in';
import { SyncSplitRuleRecipientsDtoOut } from './dtos/sync-split-rule-recipients.dto-out';

@Injectable()
export class SyncSplitRuleRecipientsUseCase {
  constructor(
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,
    private readonly findSplitRuleByUniqueIdService: FindSplitRuleByUniqueIdService,
    private readonly findSplitRecipientByUniqueIdService: FindSplitRecipientByUniqueIdService,
    private readonly findSplitRuleRecipientByRuleAndRecipientService: FindSplitRuleRecipientByRuleAndRecipientService,
    private readonly createSplitRuleRecipientService: CreateSplitRuleRecipientService,
    private readonly updateSplitRuleRecipientService: UpdateSplitRuleRecipientService,
    private readonly getAllSplitRuleRecipientsBySplitRuleIdService: GetAllSplitRuleRecipientsBySplitRuleIdService,
  ) {}

  async exec(
    dtoIn: SyncSplitRuleRecipientsDtoIn,
  ): Promise<SyncSplitRuleRecipientsDtoOut> {
    await this.resolveActorAuthorizationService.exec({
      token: dtoIn.token,
      requiredEntity: 'splitRuleRecipient',
      requiredAction: 'syncSplitRuleRecipients',
    });

    const splitRuleDtoOut = await this.findSplitRuleByUniqueIdService.exec(
      new FindSplitRuleByUniqueIdDtoIn(dtoIn.splitRuleId),
    );

    let createdCount = 0;
    let updatedCount = 0;
    let inactivatedCount = 0;

    const syncedRecipients: Array<Record<string, unknown>> = [];

    for (const recipient of dtoIn.recipients) {
      await this.validateSplitRecipientExists(recipient.splitRecipientId);

      const existingDtoOut =
        await this.findSplitRuleRecipientByRuleAndRecipientService.exec(
          new FindSplitRuleRecipientByRuleAndRecipientDtoIn({
            splitRuleId: dtoIn.splitRuleId,
            splitRecipientId: recipient.splitRecipientId,
          }),
        );

      if (existingDtoOut.splitRuleRecipient === null) {
        const created = await this.createRecipient(dtoIn.splitRuleId, recipient);

        createdCount++;
        syncedRecipients.push(created);
        continue;
      }

      const updated = await this.updateRecipient(
        String(existingDtoOut.splitRuleRecipient._id),
        recipient,
        'active',
      );

      updatedCount++;
      syncedRecipients.push(updated);
    }

    const currentRecipientsDtoOut =
      await this.getAllSplitRuleRecipientsBySplitRuleIdService.exec(
        new GetAllSplitRuleRecipientsBySplitRuleIdDtoIn(dtoIn.splitRuleId),
      );

    const receivedRecipientIds = new Set(
      dtoIn.recipients.map((recipient) => recipient.splitRecipientId),
    );

    for (const current of currentRecipientsDtoOut.splitRuleRecipients) {
      const currentSplitRecipientId = String(current.splitRecipientId ?? '');

      if (receivedRecipientIds.has(currentSplitRecipientId)) {
        continue;
      }

      if (String(current.status ?? '') === 'inactive') {
        continue;
      }

      await this.updateSplitRuleRecipientService.exec(
        new UpdateSplitRuleRecipientDtoIn(
          String(current._id),

          null,
          null,

          null,
          null,
          null,
          null,
          null,
          null,

          null,
          null,

          'inactive',
          'SyncSplitRuleRecipientsUseCase',
        ),
      );

      inactivatedCount++;
    }

    return new SyncSplitRuleRecipientsDtoOut(
      splitRuleDtoOut.splitRule,
      syncedRecipients,
      createdCount,
      updatedCount,
      inactivatedCount,
    );
  }

  private async validateSplitRecipientExists(
    splitRecipientId: string,
  ): Promise<void> {
    await this.findSplitRecipientByUniqueIdService.exec(
      new FindSplitRecipientByUniqueIdDtoIn(splitRecipientId),
    );
  }

  private async createRecipient(
    splitRuleId: string,
    recipient: SyncSplitRuleRecipientItemDtoIn,
  ): Promise<Record<string, unknown>> {
    const created = await this.createSplitRuleRecipientService.exec(
      new CreateSplitRuleRecipientDtoIn(
        splitRuleId,
        recipient.splitRecipientId,

        recipient.role,
        recipient.percentage,
        recipient.fixedAmount,
        recipient.liableForGatewayFee,
        recipient.liableForRefund,
        recipient.priority,

        recipient.metadata,
        recipient.config,

        recipient.status,
      ),
    );

    return created.splitRuleRecipient;
  }

  private async updateRecipient(
    splitRuleRecipientId: string,
    recipient: SyncSplitRuleRecipientItemDtoIn,
    status: string,
  ): Promise<Record<string, unknown>> {
    const updated = await this.updateSplitRuleRecipientService.exec(
      new UpdateSplitRuleRecipientDtoIn(
        splitRuleRecipientId,

        null,
        null,

        recipient.role,
        recipient.percentage,
        recipient.fixedAmount,
        recipient.liableForGatewayFee,
        recipient.liableForRefund,
        recipient.priority,

        recipient.metadata,
        recipient.config,

        status,
        'SyncSplitRuleRecipientsUseCase',
      ),
    );

    return updated.splitRuleRecipient;
  }
}
